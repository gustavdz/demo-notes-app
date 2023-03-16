import { Bucket, StackContext, Table } from "sst/constructs";

interface IStorageStack {
	table: Table;
	bucket: Bucket;
}
export const StorageStack = ({ stack }: StackContext): IStorageStack => {
	// Create an S3 bucket
	const bucket: Bucket = new Bucket(stack, "Uploads", {
		cors: [
			{
				maxAge: "1 day",
				allowedOrigins: ["*"],
				allowedHeaders: ["*"],
				allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
			},
		],
	});
	// Create the DynamoDB table
	const table: Table = new Table(stack, "Notes", {
		fields: {
			userId: "string",
			noteId: "string",
		},
		primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
	});

	return {
		table,
		bucket,
	};
};
