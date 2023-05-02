import handler from "@notes/core/handler";
import connectToDB from "@notes/core/db";
import Note from "@notes/core/db/entity/Note";
import noteRepository from "@notes/core/data/Note";
// import { getUserDataFromCognito } from "@notes/core/utils/getUserDataFromCognito";
import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from "aws-lambda";

export const main = handler(
	async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<APIGatewayProxyResultV2> => {
		try {
			const noteId: string = event.pathParameters?.id || "";
			await connectToDB();
			// const userAttributes = await getUserDataFromCognito(event);
			const note: Note | null = await noteRepository.findNoteById(noteId);

			// Return the matching list of items in response body
			return { statusCode: 200, body: JSON.stringify(note) };
		} catch (error) {
			throw new Error(JSON.stringify(error));
		}
	},
);
