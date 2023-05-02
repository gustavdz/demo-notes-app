import * as iam from "aws-cdk-lib/aws-iam";
import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
import { AuthStack } from "./AuthStack";

export const ApiStack = ({ stack }: StackContext) => {
	const { bucket } = use(StorageStack);
	const { auth } = use(AuthStack);
	// Create the API
	const api = new Api(stack, "Api", {
		authorizers: {
			jwt: {
				type: "user_pool",
				userPool: {
					id: auth.userPoolId,
					clientIds: [auth.userPoolClientId],
				},
			},
		},
		defaults: {
			function: {
				environment: {
					STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
					DB_TYPE: process.env.DB_TYPE || "mysql",
					DB_HOST: process.env.DB_HOST || "localhost",
					DB_PORT: process.env.DB_PORT || "3306",
					DB_NAME: process.env.DB_NAME || "",
					DB_USER: process.env.DB_USER || "",
					DB_PASSWORD: process.env.DB_PASSWORD || "",
				},
			},
			authorizer: "jwt",
		},
		routes: {
			"POST /notes": {
				function: { handler: "packages/functions/src/modules/note/create.main", functionName: "notesCreate" },
			},
			"GET /notes/{id}": {
				function: { handler: "packages/functions/src/modules/note/get.main", functionName: "notesGetById" },
			},
			"GET /notes": {
				function: { handler: "packages/functions/src/modules/note/list.main", functionName: "notesGetList" },
			},
			"PUT /notes/{id}": {
				function: { handler: "packages/functions/src/modules/note/update.main", functionName: "notesUpdateById" },
			},
			"DELETE /notes/{id}": {
				function: { handler: "packages/functions/src/modules/note/delete.main", functionName: "notesDeleteById" },
			},
			"POST /billing": {
				function: { handler: "packages/functions/src/billing.main", functionName: "billingCreate" },
			},
		},
		cors: {
			allowMethods: ["ANY"],
			allowOrigins: ["*"],
		},
	});
	const permissions: iam.PolicyStatement = new iam.PolicyStatement({
		actions: [
			"cognito-idp:*",
			// "cognito-idp:AdminCreateUser",
			// "cognito-idp:AdminDeleteUser",
			// "cognito-idp:AdminSetUserPassword",
			// "cognito-idp:AdminEnableUser",
			// "cognito-idp:AdminDisableUser",
		],
		effect: iam.Effect.ALLOW,
		resources: ["*"],
	});
	api.attachPermissions([
		// new cdk.aws() -
		// 	iam.PolicyStatement({
		// 		actions: [
		// 			"cognito-idp:*",
		// 			// "cognito-idp:AdminCreateUser",
		// 			// "cognito-idp:AdminDeleteUser",
		// 			// "cognito-idp:AdminSetUserPassword",
		// 			// "cognito-idp:AdminEnableUser",
		// 			// "cognito-idp:AdminDisableUser",
		// 		],
		// 		effect: iam.Effect.ALLOW,
		// 		resources: ["*"],
		// 	}),
		permissions,
	]);

	// Show the API endpoint in the output
	stack.addOutputs({
		ApiEndpoint: api.url,
	});

	auth.attachPermissionsForAuthUsers(stack, [
		// Allow access to the API
		api,
		// Policy granting access to a specific folder in the bucket
		new iam.PolicyStatement({
			actions: ["s3:*"],
			effect: iam.Effect.ALLOW,
			resources: [bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*"],
		}),
	]);

	// Return the API resource
	return {
		api,
	};
};
