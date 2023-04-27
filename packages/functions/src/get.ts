import handler from "@notes/core/handler";
import { Table } from "sst/node/table";
import dynamoDb from "@notes/core/dynamodb";
import { APIGatewayProxyEventV2WithIAMAuthorizer, APIGatewayProxyResultV2 } from "aws-lambda";
import AWS from "aws-sdk";

export const main = handler(
	async (event: APIGatewayProxyEventV2WithIAMAuthorizer): Promise<APIGatewayProxyResultV2> => {
		const noteId = event.pathParameters?.id;
		const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
			TableName: Table.Notes.tableName,
			// 'Key' defines the partition key and sort key of the item to be retrieved
			Key: {
				userId: event.requestContext.authorizer.iam.userId,
				noteId, // The id of the note from the path
			},
		};

		const result = await dynamoDb.get(params);
		if (!result.Item) {
			throw new Error("Item not found.");
		}

		// Return the retrieved item
		return { statusCode: 200, body: JSON.stringify(result.Item) };
	},
);
