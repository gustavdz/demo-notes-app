import Joi from "joi";
import { INoteRequest } from "../interfaces";

const createNoteRequestValidation = (payload: INoteRequest | undefined): void => {
	const schema = Joi.object({
		name: Joi.string().required(),
		content: Joi.string().required(),
		attachment: Joi.string().allow(""),
	});
	const { error } = schema.validate(payload);
	if (error) {
		throw new Error(error.message);
	}
	return;
};
export default createNoteRequestValidation;
