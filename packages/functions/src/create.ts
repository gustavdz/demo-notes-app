import handler from "@notes/core/handler";
import { Table } from "sst/node/table";
import * as uuid from "uuid";
import dynamoDb from "@notes/core/dynamodb";
import { APIGatewayProxyEventV2WithIAMAuthorizer, APIGatewayProxyResultV2 } from "aws-lambda";
import AWS from "aws-sdk";

export const main = handler(
	async (event: APIGatewayProxyEventV2WithIAMAuthorizer): Promise<APIGatewayProxyResultV2> => {
		const data = JSON.parse(event.body || "");

		const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
			TableName: Table.Notes.tableName,
			Item: {
				// The attributes of the item to be created
				userId: event.requestContext.authorizer.iam.userId,
				noteId: uuid.v1(), // A unique uuid
				content: data.content, // Parsed from request body
				attachment: data.attachment, // Parsed from request body
				createdAt: Date.now(), // Current Unix timestamp
			},
		};

		const result = await dynamoDb.put(params);
		if (!result) {
			throw new Error("Item not found.");
		}
		return { statusCode: 200, body: JSON.stringify(params.Item) };
	},
);
