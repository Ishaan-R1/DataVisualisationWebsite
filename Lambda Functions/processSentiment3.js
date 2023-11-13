// import relevant packages
import {
  ComprehendClient,
  DetectSentimentCommand,
} from "@aws-sdk/client-comprehend";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// create clients to use Comprehend and DynamoDB
const comprehendClient = new ComprehendClient();
const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
  // Log event
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(event.Records));
  // Loop through all records and check for records inserted to DB
  for (let record of event.Records) {
    console.log(record);
    if (record.eventName === "INSERT") {
      // Get team name, timestamp and article text from NewsAPI
      let teamName = record.dynamodb.NewImage.TeamName.S;
      let timeStamp = record.dynamodb.NewImage.ResultTimeStamp.N;
      let text = record.dynamodb.NewImage.Text.S;
      // Log values
      console.log("Team Name: " + teamName);
      console.log("Time Stamp: " + timeStamp);
      console.log("Text: " + text);

      // Create params to detect sentiment using Comprehend of text uploaded to DB
      let params2 = {
        LanguageCode: "en",
        Text: text,
      };
      const detectSentimentCommand = new DetectSentimentCommand(params2);
      // Store result of sentiment in variable
      const result = await comprehendClient.send(detectSentimentCommand);

      // Log sentiment value and score
      console.log(JSON.stringify(result.Sentiment));
      console.log(JSON.stringify(result.SentimentScore));

      // Store each score in appropriate variable
      let positive = result.SentimentScore.Positive;
      let negative = result.SentimentScore.Negative;
      let neutral = result.SentimentScore.Neutral;
      let mixed = result.SentimentScore.Mixed;

      // Create params to store data in DB
      const params = {
        // Specifies DB name
        TableName: "SentimentAnalysisData2",
        Item: {
          //Specifies all items to upload
          TeamName: { S: teamName },
          ResultTimeStamp: { N: timeStamp },
          Text: { S: text },
          Positive: { N: `${positive}` },
          Negative: { N: `${negative}` },
          Neutral: { N: `${neutral}` },
          Mixed: { N: `${mixed}` },
        },
      };
      try {
        // Store data in DynamoDB Table
        const data = await ddbClient.send(new PutItemCommand(params));
        console.log(data);
        console.log("Text stored.");
      } catch (err) {
        // Handle errors
        const { requestId, cfId, extendedRequestId } = err.$$metadata;
        console.log({ requestId, cfId, extendedRequestId });
        return {
          statusCode: 500,
          body: "Server Error: " + JSON.stringify(err),
        };
      }
    }
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
