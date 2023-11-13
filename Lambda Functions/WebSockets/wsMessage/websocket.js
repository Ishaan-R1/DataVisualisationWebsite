let AWS = require("aws-sdk");

//Import functions for database
let db = require("database");
let ddbClient = new AWS.DynamoDB.DocumentClient();
AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com",
});

module.exports.sendMessage = async (connectionId, domainName, stage) => {
  //Create API Gateway management class.
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: domainName + "/" + stage,
  });
  try {
    // Scan database using parameters for specific teams sentiment result data and store in variable
    let scanResult = await ddbClient.scan(sentimentParams("Arsenal")).promise();
    let chelseaScanResult = await ddbClient
      .scan(sentimentParams("Chelsea"))
      .promise();
    let liverpoolScanResult = await ddbClient
      .scan(sentimentParams("Liverpool"))
      .promise();
    let unitedScanResult = await ddbClient
      .scan(sentimentParams("Man United"))
      .promise();
    let cityScanResult = await ddbClient
      .scan(sentimentParams("Man City"))
      .promise();

    // Define counts for each team to calculate how many elements there are
    let count = 0,
      chelseaCount = 0,
      liverpoolCount = 0,
      unitedCount = 0,
      cityCount = 0;
    // Define variables to store the sum for each value
    let positiveSum = 0,
      chelseaPositiveSum = 0,
      liverpoolPositiveSum = 0,
      unitedPositiveSum = 0,
      cityPositiveSum = 0;
    let negativeSum = 0,
      chelseaNegativeSum = 0,
      liverpoolNegativeSum = 0,
      unitedNegativeSum = 0,
      cityNegativeSum = 0;
    let neutralSum = 0,
      chelseaNeutralSum = 0,
      liverpoolNeutralSum = 0,
      unitedNeutralSum = 0,
      cityNeutralSum = 0;
    let mixedSum = 0,
      chelseaMixedSum = 0,
      liverpoolMixedSum = 0,
      unitedMixedSum = 0,
      cityMixedSum = 0;
    /* For loop to calculate how much arsenal sentiment data there is
                and the sum of the positive, negative, neutral and mixed values */
    for (let result of scanResult.Items) {
      count++;
      positiveSum += result.Positive;
      negativeSum += result.Negative;
      neutralSum += result.Neutral;
      mixedSum += result.Mixed;
    }
    /* Divide the sum of the positive, negative, neutral and mixed 
                values and divide them but how many there are to get the average */
    let positiveAverage = positiveSum / count;
    let negativeAverage = negativeSum / count;
    let neutralAverage = neutralSum / count;
    let mixedAverage = mixedSum / count;
    /* For loop to calculate how much chelsea sentiment data there is
                and the sum of the positive, negative, neutral and mixed values */
    for (let result of chelseaScanResult.Items) {
      chelseaCount++;
      chelseaPositiveSum += result.Positive;
      chelseaNegativeSum += result.Negative;
      chelseaNeutralSum += result.Neutral;
      chelseaMixedSum += result.Mixed;
    }
    /* Divide the sum of the positive, negative, neutral and mixed 
                values and divide them but how many there are to get the average */
    let chelseaPositiveAverage = chelseaPositiveSum / chelseaCount;
    let chelseaNegativeAverage = chelseaNegativeSum / chelseaCount;
    let chelseaNeutralAverage = chelseaNeutralSum / chelseaCount;
    let chelseaMixedAverage = chelseaMixedSum / chelseaCount;
    /* For loop to calculate how much liverpool sentiment data there is
                and the sum of the positive, negative, neutral and mixed values */
    for (let result of liverpoolScanResult.Items) {
      liverpoolCount++;
      liverpoolPositiveSum += result.Positive;
      liverpoolNegativeSum += result.Negative;
      liverpoolNeutralSum += result.Neutral;
      liverpoolMixedSum += result.Mixed;
    }
    /* Divide the sum of the positive, negative, neutral and mixed 
                values and divide them but how many there are to get the average */
    let liverpoolPositiveAverage = liverpoolPositiveSum / liverpoolCount;
    let liverpoolNegativeAverage = liverpoolNegativeSum / liverpoolCount;
    let liverpoolNeutralAverage = liverpoolNeutralSum / liverpoolCount;
    let liverpoolMixedAverage = liverpoolMixedSum / liverpoolCount;
    /* For loop to calculate how much man united sentiment data there is
                and the sum of the positive, negative, neutral and mixed values */
    for (let result of unitedScanResult.Items) {
      unitedCount++;
      unitedPositiveSum += result.Positive;
      unitedNegativeSum += result.Negative;
      unitedNeutralSum += result.Neutral;
      unitedMixedSum += result.Mixed;
    }
    /* Divide the sum of the positive, negative, neutral and mixed 
                values and divide them but how many there are to get the average */
    let unitedPositiveAverage = unitedPositiveSum / unitedCount;
    let unitedNegativeAverage = unitedNegativeSum / unitedCount;
    let unitedNeutralAverage = unitedNeutralSum / unitedCount;
    let unitedMixedAverage = unitedMixedSum / unitedCount;
    /* For loop to calculate how much man city sentiment data there is
                and the sum of the positive, negative, neutral and mixed values */
    for (let result of cityScanResult.Items) {
      cityCount++;
      cityPositiveSum += result.Positive;
      cityNegativeSum += result.Negative;
      cityNeutralSum += result.Neutral;
      cityMixedSum += result.Mixed;
    }
    /* Divide the sum of the positive, negative, neutral and mixed 
                values and divide them but how many there are to get the average an store in appropriate variables */
    let cityPositiveAverage = cityPositiveSum / cityCount;
    let cityNegativeAverage = cityNegativeSum / cityCount;
    let cityNeutralAverage = cityNeutralSum / cityCount;
    let cityMixedAverage = cityMixedSum / cityCount;

    // Scan database using parameters for specific teams numerical data and store in variable
    let numericalResult = await ddbClient
      .scan(allNumericalParams("Arsenal"))
      .promise();
    let chelseaNumericalResult = await ddbClient
      .scan(allNumericalParams("Chelsea"))
      .promise();
    let liverpoolNumericalResult = await ddbClient
      .scan(allNumericalParams("Liverpool"))
      .promise();
    let unitedNumericalResult = await ddbClient
      .scan(allNumericalParams("United"))
      .promise();
    let cityNumericalResult = await ddbClient
      .scan(allNumericalParams("City"))
      .promise();

    // Scan database using parameters for specific teams prediction data and store in variable
    let arsenalPredictionsScan = await ddbClient
      .scan(predictionParams("Arsenal"))
      .promise();
    let chelseaPredictionsScan = await ddbClient
      .scan(predictionParams("Chelsea"))
      .promise();
    let unitedPredictionsScan = await ddbClient
      .scan(predictionParams("United"))
      .promise();
    let liverpoolPredictionsScan = await ddbClient
      .scan(predictionParams("Liverpool"))
      .promise();
    let cityPredictionsScan = await ddbClient
      .scan(predictionParams("City"))
      .promise();

    // Create arrays to store numerical data from database
    let x = [],
      y = [];
    let chelseaX = [],
      chelseaY = [];
    let liverpoolX = [],
      liverpoolY = [];
    let unitedX = [],
      unitedY = [];
    let cityX = [],
      cityY = [];

    // Loop through all results and push numerical results to correct arrays for each team
    for (let result of numericalResult.Items) {
      if (result.ResultTimeStamp > 0) {
        x.push(result.ResultTimeStamp);
        y.push(result.Result);
      }
    }
    for (let result of chelseaNumericalResult.Items) {
      if (result.ResultTimeStamp > 0) {
        chelseaX.push(result.ResultTimeStamp);
        chelseaY.push(result.Result);
      }
    }
    for (let result of liverpoolNumericalResult.Items) {
      if (result.ResultTimeStamp > 0) {
        liverpoolX.push(result.ResultTimeStamp);
        liverpoolY.push(result.Result);
      }
    }
    for (let result of unitedNumericalResult.Items) {
      if (result.ResultTimeStamp > 0) {
        unitedX.push(result.ResultTimeStamp);
        unitedY.push(result.Result);
      }
    }
    for (let result of cityNumericalResult.Items) {
      if (result.ResultTimeStamp > 0) {
        cityX.push(result.ResultTimeStamp);
        cityY.push(result.Result);
      }
    }

    // Create arrays to hold prediction quantile 0.1 and 0.9 values for each team
    let arsenalQuantile1 = [],
      arsenalQuantile9 = [];
    let chelseaQuantile1 = [],
      chelseaQuantile9 = [];
    let liverpoolQuantile1 = [],
      liverpoolQuantile9 = [];
    let unitedQuantile1 = [],
      unitedQuantile9 = [];
    let cityQuantile1 = [],
      cityQuantile9 = [];

    // Create arrays to hold prediction Y values for each team
    let arsenalPredictionsY = [],
      chelseaPredictionsY = [],
      liverpoolPredictionsY = [],
      unitedPredictionsY = [],
      cityPredictionsY = [];

    // Loop through all results and push prediction results to correct arrays for each team
    for (let result of arsenalPredictionsScan.Items) {
      arsenalPredictionsY.push(result.Mean);
      arsenalQuantile1.push(result.Quantile1);
      arsenalQuantile9.push(result.Quantile9);
    }
    for (let result of chelseaPredictionsScan.Items) {
      chelseaPredictionsY.push(result.Mean);
      chelseaQuantile1.push(result.Quantile1);
      chelseaQuantile9.push(result.Quantile9);
    }
    for (let result of unitedPredictionsScan.Items) {
      unitedPredictionsY.push(result.Mean);
      unitedQuantile1.push(result.Quantile1);
      unitedQuantile9.push(result.Quantile9);
    }
    for (let result of liverpoolPredictionsScan.Items) {
      liverpoolPredictionsY.push(result.Mean);
      liverpoolQuantile1.push(result.Quantile1);
      liverpoolQuantile9.push(result.Quantile9);
    }
    for (let result of cityPredictionsScan.Items) {
      cityPredictionsY.push(result.Mean);
      cityQuantile1.push(result.Quantile1);
      cityQuantile9.push(result.Quantile9);
    }
    // Slicing arrays to get the last 100 elements before pushing to client
    x = x.slice(
      numericalResult.Items.length - 100,
      numericalResult.Items.length
    );
    y = y.slice(
      numericalResult.Items.length - 100,
      numericalResult.Items.length
    );

    chelseaX = chelseaX.slice(
      chelseaNumericalResult.Items.length - 100,
      chelseaNumericalResult.Items.length
    );
    chelseaY = chelseaY.slice(
      chelseaNumericalResult.Items.length - 100,
      chelseaNumericalResult.Items.length
    );

    liverpoolX = liverpoolX.slice(
      liverpoolNumericalResult.Items.length - 100,
      liverpoolNumericalResult.Items.length
    );
    liverpoolY = liverpoolY.slice(
      liverpoolNumericalResult.Items.length - 100,
      liverpoolNumericalResult.Items.length
    );

    unitedX = unitedX.slice(
      unitedNumericalResult.Items.length - 100,
      unitedNumericalResult.Items.length
    );
    unitedY = unitedY.slice(
      unitedNumericalResult.Items.length - 100,
      unitedNumericalResult.Items.length
    );

    cityX = cityX.slice(
      cityNumericalResult.Items.length - 100,
      cityNumericalResult.Items.length
    );
    cityY = cityY.slice(
      cityNumericalResult.Items.length - 100,
      cityNumericalResult.Items.length
    );

    // Construct data structure
    const data = {
      // Store arsenal actual numerical values, sentiment results and all prediction values
      Arsenal: {
        actual: {
          x: x,
          y: y,
        },
        sentiment: {
          positive: positiveAverage,
          negative: negativeAverage,
          neutral: neutralAverage,
          mixed: mixedAverage,
        },
        predictions: {
          x: x,
          y: arsenalPredictionsY,
          quantile1: arsenalQuantile1,
          quantile9: arsenalQuantile9,
        },
      },
      Chelsea: {
        // Store chelsea actual numerical values, sentiment results and all prediction values
        actual: {
          x: chelseaX,
          y: chelseaY,
        },
        sentiment: {
          positive: chelseaPositiveAverage,
          negative: chelseaNegativeAverage,
          neutral: chelseaNeutralAverage,
          mixed: chelseaMixedAverage,
        },
        predictions: {
          x: chelseaX,
          y: chelseaPredictionsY,
          quantile1: chelseaQuantile1,
          quantile9: chelseaQuantile9,
        },
      },
      Liverpool: {
        // Store liverpool actual numerical values, sentiment results and all prediction values
        actual: {
          x: liverpoolX,
          y: liverpoolY,
        },
        sentiment: {
          positive: liverpoolPositiveAverage,
          negative: liverpoolNegativeAverage,
          neutral: liverpoolNeutralAverage,
          mixed: liverpoolMixedAverage,
        },
        predictions: {
          x: liverpoolX,
          y: liverpoolPredictionsY,
          quantile1: liverpoolQuantile1,
          quantile9: liverpoolQuantile9,
        },
      },
      United: {
        // Store united actual numerical values, sentiment results and all prediction values
        actual: {
          x: unitedX,
          y: unitedY,
        },
        sentiment: {
          positive: unitedPositiveAverage,
          negative: unitedNegativeAverage,
          neutral: unitedNeutralAverage,
          mixed: unitedMixedAverage,
        },
        predictions: {
          x: unitedX,
          y: unitedPredictionsY,
          quantile1: unitedQuantile1,
          quantile9: unitedQuantile9,
        },
      },
      City: {
        // Store city actual numerical values, sentiment results and all prediction values
        actual: {
          x: cityX,
          y: cityY,
        },
        sentiment: {
          positive: cityPositiveAverage,
          negative: cityNegativeAverage,
          neutral: cityNeutralAverage,
          mixed: cityMixedAverage,
        },
        predictions: {
          x: cityX,
          y: cityPredictionsY,
          quantile1: cityQuantile1,
          quantile9: cityQuantile9,
        },
      },
    };
    try {
      console.log("Sending message to: " + connectionId);

      // Parameters for API Gateway
      let apiMsg = {
        ConnectionId: connectionId,
        Data: JSON.stringify(data),
      };
      // Log result once API Gateway executes
      await apigwManagementApi.postToConnection(apiMsg).promise();
      console.log("Message sent to: " + connectionId);
    } catch (err) {
      // Handle errors
      console.error("Error sending message: " + JSON.stringify(err));
    }
  } catch (er) {
    // Handle errors
    console.log("error: " + JSON.stringify(er));
  }
};
// Function to return params object of specific team to get updated predictions
function predictionParams(teamName) {
  let params = {
    TableName: "PredictionsOfNumerical_2",
    FilterExpression: "TeamName = :team",
    ExpressionAttributeValues: {
      // Get data of specific team name based on parameter provided.
      ":team": teamName,
    },
  };
  return params;
}
// Function to return params object of specific team to get updated numerical data
function allNumericalParams(teamName) {
  let params = {
    TableName: "NumericalDataComplete_3",
    FilterExpression: "TeamName = :team",
    ExpressionAttributeValues: {
      // Get data of specific team name based on parameter provided.
      ":team": teamName,
    },
  };
  return params;
}
// Function to return params object of specific team to get updated sentiment results
function sentimentParams(teamName) {
  let params = {
    TableName: "SentimentAnalysisData2",
    FilterExpression: "TeamName = :team",
    ExpressionAttributeValues: {
      // Get data of specific team name based on parameter provided.
      ":team": teamName,
    },
  };
  return params;
}

module.exports.getSendMessagePromises = async (message, domainName, stage) => {
  // Get connection IDs of clients
  let clientIdArray = (await db.getConnectionIds()).Items;
  console.log("\nClient IDs:\n" + JSON.stringify(clientIdArray));

  // Create API Gateway management class.
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: domainName + "/" + stage,
  });

  // send message to clients that are connected
  let msgPromiseArray = clientIdArray.map(async (item) => {
    try {
      // Log message
      console.log("Sending message '" + message + "' to: " + item.ConnectionId);

      // Parameters for API Gateway
      let apiMsg = {
        ConnectionId: item.ConnectionId,
        Data: message,
      };

      // Log result once API Gateway executes
      await apigwManagementApi.postToConnection(apiMsg).promise();
      console.log("Message '" + message + "' sent to: " + item.ConnectionId);
    } catch (err) {
      console.log("Failed to send message to: " + item.ConnectionId);

      // Delete connection ID from database
      if (err.statusCode == 410) {
        try {
          await db.deleteConnectionId(item.ConnectionId);
        } catch (err) {
          // Handle errors
          console.log("ERROR deleting connectionId: " + JSON.stringify(err));
          throw err;
        }
      } else {
        // Handle errors
        console.log("UNKNOWN ERROR: " + JSON.stringify(err));
        throw err;
      }
    }
  });

  return msgPromiseArray;
};
