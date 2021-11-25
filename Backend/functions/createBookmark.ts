const AWS = require("aws-sdk");
const DocClient = new AWS.DynamoDB.DocumentClient();
import Bookmark from "./BookmarksType";

async function createBookmark(bookmark: Bookmark) {
  const params = {
    TableName: process.env.BOOKMARKS_TABLE,
    Item: bookmark,
  };
  try {
    await DocClient.put(params).promise();
    return bookmark;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default createBookmark;
