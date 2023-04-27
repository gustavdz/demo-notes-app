import handler from "@notes/core/handler";
import Stripe from "stripe";
import { calculateCost } from "@notes/core/cost";
import { APIGatewayProxyEventV2WithIAMAuthorizer } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2WithIAMAuthorizer) => {
	const { storage, source } = JSON.parse(event.body || "");
	const amount = calculateCost(storage);
	const description = "Scratch charge";

	// Load our secret key from the  environment variables
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2022-11-15" });

	const result = await stripe.charges.create({
		source,
		amount,
		description,
		currency: "usd",
	});

	return {
		statusCode: 200,
		body: JSON.stringify({ status: 200 }),
	};
});
