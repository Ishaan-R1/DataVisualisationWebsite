{
  // Importing relevant modules
  const AWS2 = require("aws-sdk");
  const NewsAPI = require("newsapi");

  // import dotenv
  const dotenv2 = require("dotenv");

  // Connect to DynamoDB
  AWS2.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
  });
  // Create client to connect to DynamoDB
  let documentClient = new AWS2.DynamoDB.DocumentClient();

  // Copy variables in file into environment variables
  dotenv2.config();

  // Create NewsAPI class
  const newsapi = new NewsAPI(process.env.NEWS_API);

  // Create structure of NewsAPI data
  interface Article {
    title: string;
    publishedAt: string;
  }
  // Create structure of NewsAPI data
  interface NewsAPIResult {
    articles: Array<Article>;
  }

  // Function to search API and output titles and dates of specific articles
  async function getTextData(teamName: string): Promise<void> {
    // Search NewsAPI and with a team name as parameter to get 100 articles
    const articleResults: NewsAPIResult = await newsapi.v2.everything({
      q: teamName,
      pageSize: 100,
      language: "en",
    });

    // Loop through results to get article times and titles
    for (let article of articleResults.articles) {
      // Convert publishedAt time to unix time and log time and title
      const date:Date = new Date(article.publishedAt);
      console.log("Unix Time: " + date.getTime() + "; Title: " + article.title);
    }
    let promiseArray: Array<Promise<string>> = [];
    // Loop through articles provided and call function to push data to DynamoDB
    articleResults.articles.forEach((element) => {
      let unixtime = new Date(element.publishedAt);
      console.log(
        "Article Publised Time: " +
          unixtime.getTime() +
          ". Article Text: " +
          element.title
      );
      console.log();

      // Push data to promise array and call function to store in DynamoDB
      promiseArray.push(saveData(teamName, unixtime.getTime(), element.title));
      console.log("Text Stored");
    });
  }
  // Call function to store all text data for specific teams
  getTextData("Arsenal");
  getTextData("Chelsea");
  getTextData("Liverpool");
  getTextData("Man United");
  getTextData("Man City");

  //Function to save data in specific table
  function saveData(
    teamName: string,
    unixtime: number,
    text: string
  ): Promise<string> {
    // Specifying table and items to store
    let params = {
      TableName: "TextData2",
      Item: {
        TeamName: teamName,
        ResultTimeStamp: unixtime,
        Text: text,
      },
    };

    //Store data in DynamoDB and handle errors
    return new Promise<string>((resolve, reject) => {
      documentClient.put(params, (err, data) => {
        if (err) {
          // Handle errors
          reject("Unable to add item: " + JSON.stringify(err));
        } else {
          resolve("Item " + unixtime + " Added");
        }
      });
    });
  }
}
