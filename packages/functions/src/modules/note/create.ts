import handler from "@notes/core/handler";
import connectToDB from "@notes/core/db";
import Note from "@notes/core/db/entity/Note";
import noteRepository from "@notes/core/data/Note";
import { getUserDataFromCognito } from "@notes/core/utils/getUserDataFromCognito";

import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from "aws-lambda";

import createNoteRequestValidation from "./validation/create-note";
import { INoteRequest } from "./interfaces";

export const main = handler(
	async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<APIGatewayProxyResultV2> => {
		const payload: INoteRequest = JSON.parse(String(event.body));
		createNoteRequestValidation(payload);
		await connectToDB();
		const { content, attachment, name } = payload;

		const userAttributes = await getUserDataFromCognito(event);

		const note: Note = await noteRepository.createNote({ name, content, attachment, userId: userAttributes.cognitoId });

		if (!note) {
			throw new Error("Error");
		}
		return { statusCode: 201, body: JSON.stringify(note) };
	},
);
