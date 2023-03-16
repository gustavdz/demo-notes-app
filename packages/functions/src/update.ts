import handler from "@notes/core/handler";
import { Table } from "sst/node/table";
import dynamoDb from "@notes/core/dynamodb";
import { APIGatewayProxyEventV2WithIAMAuthorizer } from "aws-lambda";
import AWS from "aws-sdk";

export const main = handler(async (event: APIGatewayProxyEventV2WithIAMAuthorizer) => {
	const data = JSON.parse(event.body || "");
	const noteId = event.pathParameters?.id;
	const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: Table.Notes.tableName,
		// 'Key' defines the partition key and sort key of the item to be updated
		Key: {
			userId: event.requestContext.authorizer.iam.userId,
			noteId, // The id of the note from the path
		},
		// 'UpdateExpression' defines the attributes to be updated
		// 'ExpressionAttributeValues' defines the value in the update expression
		UpdateExpression: "SET content = :content, attachment = :attachment",
		ExpressionAttributeValues: {
			":attachment": data.attachment || null,
			":content": data.content || null,
		},
		// 'ReturnValues' specifies if and how to return the item's attributes,
		// where ALL_NEW returns all attributes of the item after the update; you
		// can inspect 'result' below to see how it works with different settings
		ReturnValues: "ALL_NEW",
	};

	await dynamoDb.update(params);

	return { status: true };
});
