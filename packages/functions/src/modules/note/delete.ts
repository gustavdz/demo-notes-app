import handler from "@notes/core/handler";
import Note from "@notes/core/db/entity/Note";
import connectToDB from "@notes/core/db";
import noteRepository from "@notes/core/data/Note";
// import { getUserDataFromCognito } from "@notes/core/utils/getUserDataFromCognito";
import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from "aws-lambda";

export const main = handler(
	async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<APIGatewayProxyResultV2> => {
		const noteId: string = event.pathParameters?.id || "";
		await connectToDB();
		const note: Note | null = await noteRepository.findNoteById(noteId);
		if (!note) {
			throw new Error("Error");
		}
		await noteRepository.deleteNoteById(noteId);

		// Return the matching list of items in response body
		return { statusCode: 200, body: JSON.stringify({ noteId }) };
	},
);
