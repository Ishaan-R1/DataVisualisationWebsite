// Get relevant packages
let AWS = require("aws-sdk");

// Create clients to use DynamoDB
let documentClient = new AWS.DynamoDB.DocumentClient();

//Returns all of the connection IDs
module.exports.getConnectionIds = async () => {
  let params = {
    TableName: "WebSocketClients",
  };
  return documentClient.scan(params).promise();
};

// Delete connection ID
module.exports.deleteConnectionId = async (connectionId) => {
  console.log("Deleting connection Id: " + connectionId);

  // Create params to delete specified connection ID
  let params = {
    TableName: "WebSocketClients",
    Key: {
      ConnectionId: connectionId,
    },
  };
  return documentClient.delete(params).promise();
};
