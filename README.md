# DataVisualisationWebsite
## Overview
This web application leverages web services to display numerical data, predictions, and sentiment analysis results. 

The primary features include:
Visualization of Numerical Data
Predictions Using Machine Learning
Sentiment Analysis Results

## Features
1. Numerical Data Visualization
The website retrieves numerical data from a csv file on football results. The scores are converted into a result and the data is visualized using interactive charts and graphs.

2. Predictions with Machine Learning
Machine learning is achieved with AWS Sagemaker make predictions about future results of 5 teams on the numerical data. These predictions are displayed alongside the actual data, providing insights into potential trends.

3. Sentiment Analysis
Article headlines from News API is used as text data for sentiment analysis. The results are presented in a pie chart, allowing users to gauge public sentiment related to the numerical data.

## Architecture
The project follows a serverless architecture hosted on AWS using Lambda functions. TypeScript is utilized for the code responsible for downloading data from web services and uploading it to the cloud. The front end is designed to display visualizations using either ordinary JavaScript or a JavaScript framework.

## Technologies Used:
AWS Lambda Functions
API Gateway
DynamoDB for Cloud Storage
TypeScript
WebSockets for Real-time Data Updates

Deployment
The web application is hosted on the cloud using serverless technology using an S3 bucket.
