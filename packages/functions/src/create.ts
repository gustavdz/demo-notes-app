import { Table } from "sst/node/table";
import * as uuid from "uuid";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";
import { APIGatewayProxyEventV2WithIAMAuthorizer } from "aws-lambda";
import AWS from "aws-sdk";

export const main = handler(async (event: APIGatewayProxyEventV2WithIAMAuthorizer) => {
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

	await dynamoDb.put(params);

	return params.Item;
});
