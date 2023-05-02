import { Cognito, StackContext } from "sst/constructs";
interface IAuthStack {
	auth: Cognito;
}

export const AuthStack = ({ stack, app }: StackContext): IAuthStack => {
	// Create a Cognito User Pool and Identity Pool
	const auth: Cognito = new Cognito(stack, "Auth", {
		login: ["email"],
	});

	// Show the auth resources in the output
	stack.addOutputs({
		Region: app.region,
		UserPoolId: auth.userPoolId,
		IdentityPoolId: auth?.cognitoIdentityPoolId || "",
		UserPoolClientId: auth.userPoolClientId,
	});

	// Return the auth resource
	return {
		auth,
	};
};
