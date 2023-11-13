exports.handler = async (event) => {
  // Log event
  console.log("EVENT:" + JSON.stringify(event));

  // return response with error message
  const response = {
    statusCode: 500,
    body: JSON.stringify("ERROR. Message not recognized."),
  };
  return response;
};
