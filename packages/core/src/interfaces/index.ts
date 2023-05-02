import {
	Context,
	APIGatewayProxyEventV2WithJWTAuthorizer,
	APIGatewayProxyResultV2,
	Callback,
	Handler,
} from "aws-lambda";
export type ILambda = (
	lambda: Handler,
) => (
	event: APIGatewayProxyEventV2WithJWTAuthorizer,
	context: Context,
	callback: Callback,
) => Promise<APIGatewayProxyResultV2>;

export interface INote {
	id?: string;
	name: string;
	content: string;
	attachment: string;
	userId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUserDataFromCognito {
	cognitoId: string;
	name: string;
	lastName: string;
	email: string;
	emailVerified: string;
}
