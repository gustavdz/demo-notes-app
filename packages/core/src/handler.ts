import { Context, APIGatewayProxyEventV2WithIAMAuthorizer } from "aws-lambda";
import * as debug from "./debug";

export default function handler(lambda: any) {
	return async function (event: APIGatewayProxyEventV2WithIAMAuthorizer, context: Context): Promise<any> {
		let body, statusCode;

		// Start debugger
		debug.init(event);

		try {
			// Run the Lambda
			body = await lambda(event, context);
			statusCode = 200;
		} catch (e: any) {
			// Print debug messages
			debug.flush(e);

			body = { error: e.message };
			statusCode = 500;
		}

		// Return HTTP response
		return {
			statusCode,
			body: JSON.stringify(body),
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
			},
		};
	};
}
