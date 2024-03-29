import handler from "@notes/core/handler";
import { Table } from "sst/node/table";
import dynamoDb from "@notes/core/dynamodb";
import { APIGatewayProxyEventV2WithIAMAuthorizer } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2WithIAMAuthorizer) => {
	const params: AWS.DynamoDB.DocumentClient.QueryInput = {
		TableName: Table.Notes.tableName,
		// 'KeyConditionExpression' defines the condition for the query
		// - 'userId = :userId': only return items with matching 'userId'
		//   partition key
		KeyConditionExpression: "userId = :userId",
		// 'ExpressionAttributeValues' defines the value in the condition
		// - ':userId': defines 'userId' to be the id of the author
		ExpressionAttributeValues: {
			":userId": event.requestContext.authorizer.iam.userId,
		},
	};

	const result = await dynamoDb.query(params);

	// Return the matching list of items in response body
	return result.Items;
});
