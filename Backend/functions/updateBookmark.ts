const AWS = require("aws-sdk");
const DocClient = new AWS.DynamoDB.DocumentClient();

type Params = {
  TableName: string | undefined;
  Key: string | {};
  ExpressionAttributeValues: any;
  ExpressionAttributeNames: any;
  UpdateExpression: string;
  ReturnValues: string;
};

async function updateBookmark(bookmark: any) {
  let params: Params = {
    TableName: process.env.BOOKMARKS_TABLE,
    Key: {
      id: bookmark.id,
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW",
  };
  let prefix = "set ";
  let attributes = Object.keys(bookmark);
  for (let i = 0; i < attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== "id") {
      params["UpdateExpression"] +=
        prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] =
        bookmark[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
  }

  try {
    await DocClient.update(params).promise();
    return bookmark;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}

export default updateBookmark;
