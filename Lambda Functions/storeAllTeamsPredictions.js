import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";

export const handler = async (event) => {
  let teamNames = new Set();
  // Loop through events and check if data has been inserted into DB
  for (let record of event.Records) {
    if (record.eventName === "INSERT") {
      // Get each team name and store in Set
      let teamName = record.dynamodb.NewImage.TeamName.S;
      teamNames.add(teamName);
    }
  }
  var response;
  // loop through set and call function to query endpoint based on name stored in DB
  for (let teamName of teamNames) {
    response = await queryEndpoint({ teamName: teamName });
  }
  return response;
};
// Function to query endpoint based on team name uploaded to DB
async function queryEndpoint(event) {
  const ddbClient = new DynamoDBClient();

  // Create params to scan numerical data
  const params = {
    // Specifying the items to return
    FilterExpression: "TeamName = :team",
    ExpressionAttributeValues: {
      ":team": { S: event.teamName },
    },
    // Specify table name
    TableName: "NumericalDataComplete_3",
  };
  // Create arrays for x and y axis
  let x = [];
  let resultsArr = [];

  try {
    const data = await ddbClient.send(new ScanCommand(params));
    // Scan to retrieve results and push to array
    for (let result of data.Items) {
      x.push(result.ResultTimeStamp.N);
      resultsArr.push(result.Result.N);
    }
    // Get start time
    let start = JSON.parse(data.Items[0].ResultTimeStamp.N);
    console.log(start);
    let date = "2000-08-19 12:00:00";
    console.log(date);
    let data2 = {
      start: date,
      target: resultsArr,
    };
    // New time after removing 100 values
    const newTimeStamp2 = "2000-09-11 06:00:00";
    console.log(
      "Hours Increased: " +
        (data2.target.length - 100) +
        "; Original: " +
        data2.start +
        "; New: " +
        newTimeStamp2
    );
    // Make sure there are more than 100 items in order to slice
    if (data2.target.length < 100) {
      const response = {
        statusCode: 200,
        body: JSON.stringify("Fewer than 100 items"),
      };
      return response;
    }
    // Get the last 100 items
    const last100Items = data2.target.slice(
      data2.target.length - 100,
      data2.target.length
    );
    // Create new structure with new time and last 100 items
    let endpointData = {
      instances: [
        {
          start: newTimeStamp2,
          target: last100Items,
        },
      ],
      // Predictions data to return
      configuration: {
        num_samples: 50,
        output_types: ["mean", "quantiles", "samples"],
        quantiles: ["0.1", "0.9"],
      },
    };
    // Create params to query endpoint with
    let paramsForEndpoint = {
      // Get the name of team from event to get appropriate endpoint name
      EndpointName: event.teamName + "Endpoint1",
      Body: JSON.stringify(endpointData),
      ContentType: "application/json",
      Accept: "application/json",
    };
    const client = new SageMakerRuntimeClient({ region: "us-east-1" });
    const { Body } = await client.send(
      new InvokeEndpointCommand(paramsForEndpoint)
    );
    // Get prediction data
    const predictionData = JSON.parse(Buffer.from(Body).toString());
    // use counter as ID when storing to DB
    let counter = 0;
    // Loop through predictions with length of 50 and get all prediction data
    for (let i = 0; i < predictionData.predictions[0].mean.length; i++) {
      // increase counter
      counter++;
      console.log(predictionData.predictions[0].mean[i]);
      let timeStamp = new Date();

      // Create params to store in new DB
      const predictionsParams = {
        TableName: "PredictionsOfNumerical_2",
        Item: {
          // Store team name as name from event and counter as ID, with mean and quantiles for predictions
          TeamName: { S: event.teamName },
          ResultTimeStamp: { N: `${counter}` },
          Mean: { N: `${predictionData.predictions[0].mean[i]}` },
          Quantile1: {
            N: `${predictionData.predictions[0].quantiles["0.1"][i]}`,
          },
          Quantile9: {
            N: `${predictionData.predictions[0].quantiles["0.9"][i]}`,
          },
        },
      };
      try {
        // Put item in DB and log msg
        const data = await ddbClient.send(
          new PutItemCommand(predictionsParams)
        );
        console.log("Text stored.");
      } catch (err) {
        // handle errors
        const { requestId, cfId, extendedRequestId } = err.$$metadata;
        console.log({ requestId, cfId, extendedRequestId });
        return {
          statusCode: 500,
          body: "Server Errorreduftt: " + JSON.stringify(err),
        };
      }
    }

    // handle errors
  } catch (err) {
    return {
      statusCode: 500,
      body: "Server Error: " + JSON.stringify(err),
    };
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
}
