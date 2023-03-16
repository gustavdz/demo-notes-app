import Stripe from "stripe";
import handler from "@notes/core/handler";
import { calculateCost } from "@notes/core/cost";
import { APIGatewayProxyEventV2WithIAMAuthorizer } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2WithIAMAuthorizer) => {
	const { storage, source } = JSON.parse(event.body || "");
	const amount = calculateCost(storage);
	const description = "Scratch charge";

	// Load our secret key from the  environment variables
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2022-11-15" });

	await stripe.charges.create({
		source,
		amount,
		description,
		currency: "usd",
	});

	return { status: true };
});
