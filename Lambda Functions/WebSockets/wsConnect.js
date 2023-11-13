// Use relevant libraries
let AWS = require("aws-sdk");

// Create clients to use DynamoDB
let ddbClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Get connection ID from event
  let connectionId = event.requestContext.connectionId;
  console.log("Client connected with ID: " + connectionId);

  // Create params to store connection ID in DynamoDB
  let params = {
    // Specify table name and items to push to DB
    TableName: "WebSocketClients",
    Item: {
      ConnectionId: connectionId,
    },
  };

  // Store connection ID to communicate with client later
  try {
    await ddbClient.put(params).promise();
    console.log("Connection ID stored.");

    // Return response if client is connected successfully
    return {
      statusCode: 200,
      body: "Client connected with ID: " + connectionId,
    };
  } catch (err) {
    // Handle erros
    return {
      statusCode: 500,
      body: "Server Error: " + JSON.stringify(err),
    };
  }
};
