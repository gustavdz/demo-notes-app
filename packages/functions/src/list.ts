import handler from "@notes/core/handler";
import { Table } from "sst/node/table";
import dynamoDb from "@notes/core/dynamodb";
import { APIGatewayProxyEventV2WithIAMAuthorizer, APIGatewayProxyResultV2 } from "aws-lambda";
import AWS from "aws-sdk";

export const main = handler(
	async (event: APIGatewayProxyEventV2WithIAMAuthorizer): Promise<APIGatewayProxyResultV2> => {
		console.log({ user: event.requestContext.authorizer.iam });
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
		return { statusCode: 200, body: JSON.stringify(result.Items) };
	},
);
