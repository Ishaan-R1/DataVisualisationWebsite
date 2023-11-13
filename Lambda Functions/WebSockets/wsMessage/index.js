// Import relevant library to use websocket functions
let ws = require("websocket");

exports.handler = async (event) => {
  try {
    console.log(JSON.stringify(event));

    // Store domain name and stage in approprate variables
    const domainName = event.requestContext.domainName;
    const stage = event.requestContext.stage;
    const connectionId = event.requestContext.connectionId;
    console.log("Domain: " + domainName + " stage: " + stage);

    // Send messages to clients that are connected
    let result = await ws.sendMessage(connectionId, domainName, stage);
    // Log result
    console.log(result);
  } catch (err) {
    // Handle errors
    return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
  }

  // Return if data is sent successfully
  return { statusCode: 200, body: "Data sent successfully." };
};
