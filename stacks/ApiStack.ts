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
			"POST /notes": {
				function: { handler: "packages/functions/src/create.main", functionName: "notesCreate" },
			},
			"GET /notes/{id}": {
				function: { handler: "packages/functions/src/get.main", functionName: "notesGetById" },
			},
			"GET /notes": {
				function: { handler: "packages/functions/src/list.main", functionName: "notesGetList" },
			},
			"PUT /notes/{id}": {
				function: { handler: "packages/functions/src/update.main", functionName: "notesUpdateById" },
			},
			"DELETE /notes/{id}": {
				function: { handler: "packages/functions/src/delete.main", functionName: "notesDeleteById" },
			},
			"POST /billing": {
				function: { handler: "packages/functions/src/billing.main", functionName: "billingCreate" },
			},
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
