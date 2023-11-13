import { addHours, format } from "date-fns";

import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";

let axios = require("axios");
let fs = require("fs");

const PLOTLY_USERNAME = "";
const PLOTLY_KEY = "";

//Initialize Plotly with user details.
let plotly = require("plotly")(PLOTLY_USERNAME, PLOTLY_KEY);

const dataUrl: string =
  "https://bmmkl4lj0d.execute-api.us-east-1.amazonaws.com/prod/";
const endpointName2: string = "SyntheicEndpoint2";

// Function to generate data based on ID provided
async function generateData(myID: string): Promise<void> {
  // Get all data from link provided with specified ID
  let syntheticData = (await axios.get(dataUrl + myID)).data.target;

  // Write test file to have all data
  fs.writeFile(
    myID + "_test.json",
    JSON.stringify(syntheticData) + "\n",
    (err: object) => {
      if (err) {
        // Log errors
        console.error("File write error: " + JSON.stringify(err));
      }
    }
  );
}
// Function to query created endpoint to generate predictions for synthetic data
async function querySyntheticEndpoint(myID: string): Promise<void> {
  let mySyntheticData = (await axios.get(dataUrl + myID)).data;
  // Get the last 100 items from synthetic data in order to provide to endpoint
  const last100Items:number = mySyntheticData.target.slice(
    mySyntheticData.target.length - 100,
    mySyntheticData.target.length
  );
  // Create a new start date by adding the original date to how many hours are left when 100 is removed
  const newDate = addHours(
    new Date(mySyntheticData.start),
    mySyntheticData.target.length - 100
  );
  // Store new timestamp
  const updatedTime = format(newDate, "yyyy-MM-dd hh:mm:ss");
  // Log results
  console.log(
    "Hours Increased: " +
      (mySyntheticData.target.length - 100) +
      "; Original: " +
      mySyntheticData.start +
      "; New: " +
      updatedTime
  );
  // Define endpoint data with new timestamp and last 100 items of original data
  let endpointData: object = {
    instances: [
      {
        start: updatedTime,
        target: last100Items,
      },
    ],
    configuration: {
      num_samples: 50,
      output_types: ["mean", "quantiles", "samples"],
      quantiles: ["0.1", "0.9"],
    },
  };
  // Specify endpoint name
  let params: any = {
    EndpointName: endpointName2,
    Body: JSON.stringify(endpointData),
    ContentType: "application/json",
    Accept: "application/json",
  };
  // Create client to use SageMaker
  const client = new SageMakerRuntimeClient({ region: "us-east-1" });
  // Send params
  const { Body } = await client.send(new InvokeEndpointCommand(params));
  // Make sure Body does not return undefined
  if (Body === undefined) {
    return;
  }
  // Get store results in variable
  const data = JSON.parse(Buffer.from(Body).toString());

  // Create arrays to store values
  let xValues: number[] = [];
  let xPredictions: number[] = [];

  // Store all x values in array
  for (let i = 0; i < mySyntheticData.target.length; ++i) {
    xValues.push(i);
  }
  // Get the length of the original synthetic data
  let lastXItem: number = mySyntheticData.target.length;
  // Get the length + the length of the predictions
  let lastYItem: number =
    mySyntheticData.target.length + data.predictions[0].mean.length;
  // Loop to start plotting after original X values up to 50 future values to plot the predictions
  for (let i = lastXItem; i < lastYItem; ++i) {
    // Push to predictions array
    xPredictions.push(i);
  }
  //Call function to plot data
  plotData(
    mySyntheticData.target,
    data.predictions[0].mean,
    data.predictions[0].quantiles["0.1"],
    data.predictions[0].quantiles["0.9"],
    xPredictions
  );
}
//Plots the specified data
async function plotData(
  yValues: number[] = [],
  yPredictions: number[] = [],
  yQuantile1: number[] = [],
  yQuantile9: number[] = [],
  xPredictions: number[] = []
) {
  //Data structure
  let syntheticData = {
    // Plot y values inputted as parameter
    y: yValues,
    type: "scatter",
    mode: "line",
    name: "Synthetic Data",
    marker: {
      color: "rgb(219, 64, 82)",
      size: 12,
    },
  };
  // Plot mean data
  let predictions = {
    x: xPredictions,
    y: yPredictions,
    type: "scatter",
    mode: "line",
    name: "Mean",
    marker: {
      color: "rgb(255,165,0)",
      size: 12,
    },
  };
  // Plot quantile 0.1 data
  let quantile1 = {
    x: xPredictions,
    y: yQuantile1,
    type: "scatter",
    mode: "line",
    name: "Quantile 0.1",
    marker: {
      color: "rgb(0, 255, 255)",
      size: 12,
    },
  };
  // Plot quantile 0.9 data
  let quantile9 = {
    x: xPredictions,
    y: yQuantile9,
    type: "scatter",
    mode: "line",
    name: "Quantile 0.9",
    marker: {
      color: "rgb(0,255,127)",
      size: 12,
    },
  };
  // Plot all above data in graph
  let data = [syntheticData, predictions, quantile1, quantile9];

  let layout = {
    title: "M00791598 Data and Predictions",
    font: {
      size: 25,
    },
    xaxis: {
      title: "Time (hours)",
    },
    yaxis: {
      title: "Value",
    },
  };
  let graphOptions = {
    layout: layout,
    filename: "Synthetic Predictions",
    fileopt: "overwrite",
  };

  return new Promise((resolve, reject) => {
    plotly.plot(data, graphOptions, function (err, msg) {
      if (err) reject(err);
      else {
        resolve(msg);
      }
    });
  });
}
// Call function to query endpoint with my ID
querySyntheticEndpoint("M00791598");
