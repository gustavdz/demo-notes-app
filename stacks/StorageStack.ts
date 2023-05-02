import { Bucket, StackContext } from "sst/constructs";

interface IStorageStack {
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

	return {
		bucket,
	};
};
