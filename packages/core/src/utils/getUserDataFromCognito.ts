import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { IUserDataFromCognito } from "../interfaces";

export const getUserDataFromCognito = async (
	event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<IUserDataFromCognito> => {
	const cognito = new CognitoIdentityServiceProvider();

	const authProviderId: string = event.requestContext.authorizer.jwt.claims.sub.toString();
	if (!authProviderId) {
		throw new Error("No authProviderId");
	}

	const userAttributesMap = {
		sub: "cognitoId",
		given_name: "name",
		family_name: "lastName",
		email: "email",
		email_verified: "emailVerified",
	};

	const iss = event.requestContext.authorizer.jwt.claims.iss.toString().split("/");
	const uerPoolId = iss[iss.length - 1];

	const { UserAttributes } = await cognito
		.adminGetUser({
			UserPoolId: uerPoolId,
			Username: authProviderId,
		})
		.promise();

	if (!UserAttributes) {
		throw new Error("User not found");
	}

	const userData: IUserDataFromCognito = UserAttributes.reduce(
		(acc, { Name: attributeName, Value: attributeValue }) => {
			// @ts-ignore
			if (userAttributesMap[attributeName]) {
				// @ts-ignore
				return { ...acc, [userAttributesMap[attributeName]]: attributeValue };
			}
			return acc;
		},
		{
			cognitoId: "",
			name: "",
			lastName: "",
			email: "",
			emailVerified: "",
		},
	);

	return userData;
};
