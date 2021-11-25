import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

export class BookmarkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "cdk-bookmark-appsync-api",
      schema: appsync.Schema.fromAsset("schema/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    const bookmarkLambda = new lambda.Function(this, "ApsyncBookmarkHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset("functions"),
      memorySize: 1024,
    });
    const lambdaDs = api.addLambdaDataSource(
      "lambdaDatasource",
      bookmarkLambda
    );

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getBookmarks",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createBookmark",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteBookmark",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateBookmark",
    });

    const bookmarkTable = new ddb.Table(this, "CDKBookmarkTable", {
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    bookmarkTable.grantFullAccess(bookmarkLambda);
    bookmarkLambda.addEnvironment("BOOKMARKS_TABLE", bookmarkTable.tableName);

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the AppSync GraphQL API ID to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIID", {
      value: api.apiId || "",
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });
  }
}
