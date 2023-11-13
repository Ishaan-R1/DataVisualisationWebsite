{
  // Importing relevant modules
  const AWS = require("aws-sdk");
  const csv = require("csv-parser");
  const fs = require("fs");

  // Connect to DynamoDB
  AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
  });
  let ddbClient = new AWS.DynamoDB.DocumentClient();
  // Locations of files to football data
  const csvFile: string = "final_dataset.csv";
  const dataFolder: string = "football";

  // Football data structure
  interface Football {
    Date: string;
    HomeTeam: string;
    AwayTeam: string;
    FTHG: string;
    FTAG: string;
  }

  const results: number[] = [];

  // Read football data
  function readFootballData(team: string): void {
    // Create array to store relevant football team based on selected elements
    let counter: number = 0;
    const teams: Football[] = [];
    /* Check if the parameter input is either "United" or "City" and then reassign 
      team variable to full team name 5o read the values of that team */
    if (team === "United") team = "Man United";
    else if (team === "City") team = "Man City";

    // Read data at location provided with folder and file name
    fs.createReadStream(dataFolder + "/" + csvFile)
      .pipe(csv())
      .on("data", (data: Football) => {
        // Store specific team data in array
        if (data.HomeTeam === team || data.AwayTeam === team) {
          teams.push(data);
        }
      })
      .on("end", () => {
        console.log("Reading Football Data Complete");
        console.log("\n");
        let promiseArray: Array<Promise<string>> = [];
        /* Set team back to original input in order to avoid spaces in team name */
        if (team === "Man United") team = "United";
        else if (team === "Man City") team = "City";

        // Display each score and send to DynamoDB
        teams.forEach((element: Football) => {
          counter++;
          // Call function to save date in US format instead of UK
          const date: Date = new Date(convertToUS(element));
          console.log(
            "Date: " +
              date.getTime() +
              " Team name: " +
              team +
              "\nHome Score: " +
              element.FTHG +
              " Away Score: " +
              element.FTAG
          );

          // If team won then send 10 points as result to DB
          if (element.FTHG > element.FTAG) {
            if (date.getTime() > 0) {
              console.log(
                counter +
                  " Date: " +
                  date.getTime() +
                  "\nTeam name: " +
                  team +
                  "\nHome Score: " +
                  element.FTHG +
                  "Away Score: " +
                  element.FTAG
              );
              console.log("WIN");
              promiseArray.push(saveData4(date.getTime(), team, 10));
              results.push(10);
            }
          } else if (element.FTHG === element.FTAG) {
            // If team draw then send 5 points as result to DB
            if (date.getTime() > 0) {
              console.log(
                counter +
                  " Date: " +
                  date.getTime() +
                  "\nTeam name: " +
                  team +
                  "\nHome Score: " +
                  element.FTHG +
                  "Away Score: " +
                  element.FTAG
              );
              console.log("DRAW");
              promiseArray.push(saveData4(date.getTime(), team, 5));
              results.push(5);
            }
          } else {
            // If team lose then send 1 points as result to DB
            if (date.getTime() > 0) {
              console.log(
                counter +
                  " Date: " +
                  date.getTime() +
                  "\nTeam name: " +
                  team +
                  "\nHome Score: " +
                  element.FTHG +
                  "Away Score: " +
                  element.FTAG
              );
              console.log("LOSS");
              promiseArray.push(saveData4(date.getTime(), team, 1));
              results.push(1);
            }
          }
        });
      });
  }
  // Function to convert UK date format into US
  function convertToUS(element: Football): string {
    let US_Date: string;
    let stringToAdd: string;

    // Store first 3 characters and as to the middle of the date to switch days and months around
    stringToAdd = element.Date.substring(0, 3);
    US_Date = element.Date.slice(3, 6) + stringToAdd + element.Date.slice(6, 9);

    return US_Date;
  }
  // Call functions for each team
  readFootballData("Arsenal");
  readFootballData("Chelsea");
  readFootballData("Liverpool");
  readFootballData("United");
  readFootballData("City");

  // Function to football data to DynamoDB
  function saveData4(
    unixtime: number,
    teamName: string,
    result: number
  ): Promise<string> {
    // Declaring table name and items to be sent to DB from csv file
    let params = {
      TableName: "NumericalDataComplete_3",
      Item: {
        ResultTimeStamp: unixtime,
        TeamName: teamName,
        Result: result,
      },
    };

    //Store data in DynamoDB and handle errors
    return new Promise<string>((resolve, reject) => {
      ddbClient.put(params, (err, data) => {
        if (err) {
          reject("Unable to add item: " + JSON.stringify(err));
        } else {
          resolve("Item added to table with id: " + unixtime);
        }
      });
    });
  }
}
