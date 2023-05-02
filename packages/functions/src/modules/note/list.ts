import Note from "@notes/core/db/entity/Note";
import connectToDB from "@notes/core/db";
import handler from "@notes/core/handler";
import { getUserDataFromCognito } from "@notes/core/utils/getUserDataFromCognito";
import noteRepository from "@notes/core/data/Note";
import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from "aws-lambda";

export const main = handler(
	async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<APIGatewayProxyResultV2> => {
		await connectToDB();
		const userAttributes = await getUserDataFromCognito(event);

		const notes: [Note[], number] = await noteRepository.getAllNotes({ where: { userId: userAttributes.cognitoId } });

		// Return the matching list of items in response body
		return { statusCode: 200, body: JSON.stringify(notes[0]) };
	},
);
