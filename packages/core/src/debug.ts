import util from "util";
import AWS from "aws-sdk";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

interface ILog {
	date: Date;
	string: string;
}
interface IArguments {
	body: any;
	pathParameters: any;
	queryStringParameters: any;
}

let logs: Array<ILog>;

// Log AWS SDK calls
AWS.config.logger = { log: debug };

export default function debug(title: string, arg: IArguments) {
	logs.push({
		date: new Date(),
		string: util.format.apply(null, [title, arg]),
	});
}

export function init(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
	logs = [];

	// Log API event
	debug("API event", {
		body: event.body,
		pathParameters: event.pathParameters,
		queryStringParameters: event.queryStringParameters,
	});
}

export function flush(e: any) {
	logs.forEach(({ date, string }) => console.debug(date, string));
	console.error(e);
}
