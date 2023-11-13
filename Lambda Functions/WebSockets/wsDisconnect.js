// Use relevant libraries
let AWS = require("aws-sdk");

// Create clients to use DynamoDB
let ddbClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  //Get connection ID from event
  let connectionId = event.requestContext.connectionId;
  console.log("Disconnecting client with ID: " + connectionId);

  // Create params to delete connection ID in DynamoDB
  let params = {
    TableName: "WebSocketClients",
    Key: {
      ConnectionId: connectionId,
    },
  };

  // Store connection ID to communicate with client later
  try {
    // Delete connection ID
    await ddbClient.delete(params).promise();
    console.log("Connection ID deleted.");

    // If successful, return response
    return {
      statusCode: 200,
      body: "Client disconnected. ID: " + connectionId,
    };
  } catch (err) {
    // Handle erros
    console.log(
      "Error disconnecting client with ID: " +
        connectionId +
        ": " +
        JSON.stringify(err)
    );
    return {
      statusCode: 500,
      body: "Server Error: " + JSON.stringify(err),
    };
  }
};
