import AWS from "aws-sdk";

import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = DynamoDBDocument.from(new DynamoDB({}));

export default {
	get: (params: AWS.DynamoDB.DocumentClient.GetItemInput) => client.get(params),
	put: (params: AWS.DynamoDB.DocumentClient.PutItemInput) => client.put(params),
	query: (params: AWS.DynamoDB.DocumentClient.QueryInput) => client.query(params),
	update: (params: AWS.DynamoDB.DocumentClient.UpdateItemInput) => client.update(params),
	delete: (params: AWS.DynamoDB.DocumentClient.DeleteItemInput) => client.delete(params),
};
