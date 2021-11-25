const AWS = require("aws-sdk");
const DocClient = new AWS.DynamoDB.DocumentClient();

async function deleteBookmark(bookmarkId: string) {
  const params = {
    TableName: process.env.BOOKMARKS_TABLE,
    Key: {
      id: bookmarkId,
    },
  };

  try {
    await DocClient.delete(params).promise();
    return bookmarkId;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default deleteBookmark;
