const AWS = require("aws-sdk");
const DocClient = new AWS.DynamoDB.DocumentClient();

async function getBookmarks() {
  const params = {
    TableName: process.env.BOOKMARKS_TABLE,
  };
  try {
    const data = await DocClient.scan(params).promise();
    return data.Items;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}

export default getBookmarks;
