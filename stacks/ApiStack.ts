import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

interface IApiStack {
	api: Api;
}
export const ApiStack = ({ stack }: StackContext): IApiStack => {
	const { table } = use(StorageStack);

	// Create the API
	const api: Api = new Api(stack, "Api", {
		defaults: {
			function: {
				bind: [table],
				environment: {
					STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
				},
			},
			authorizer: "iam",
		},
		routes: {
			"POST /notes": "packages/functions/src/create.main",
			"GET /notes/{id}": "packages/functions/src/get.main",
			"GET /notes": "packages/functions/src/list.main",
			"PUT /notes/{id}": "packages/functions/src/update.main",
			"DELETE /notes/{id}": "packages/functions/src/delete.main",
			"POST /billing": "packages/functions/src/billing.main",
		},
	});

	// Show the API endpoint in the output
	stack.addOutputs({
		ApiEndpoint: api.url,
	});

	// Return the API resource
	return {
		api,
	};
};
