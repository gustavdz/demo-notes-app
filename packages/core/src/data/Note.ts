import Note from "../db/entity/Note";
import { INote } from "../interfaces";
import dataSource from "../db/index";
import { FindManyOptions } from "typeorm";

const createNote = async (note: INote): Promise<Note> => {
	const ds = await dataSource();
	const noteRepository = ds.getRepository(Note);
	return noteRepository.save(note);
};

const findById = async (id: string): Promise<Note | null> => {
	const ds = await dataSource();
	const noteRepository = ds.getRepository(Note);
	return noteRepository.findOneBy({ id });
};

const update = async (data: INote, entity: Note): Promise<Note> => {
	const ds = await dataSource();
	const communeRepository = ds.getRepository(Note);

	communeRepository.merge(entity, data);

	return await communeRepository.save(entity);
};

const getAll = async (options?: FindManyOptions, search?: string): Promise<[Note[], number]> => {
	const ds = await dataSource();
	const noteRepository = ds.getRepository(Note);

	const queryBuilder = noteRepository.createQueryBuilder("note");

	if (options?.where) {
		queryBuilder.where(options?.where);
	}
	if (search) {
		queryBuilder.andWhere(`
        (
          note.name LIKE "%${search}%" OR
          note.content LIKE "%${search}%"
        )
        `);
	}

	if (options?.relations) {
		for await (const relation of [options.relations]) {
			queryBuilder.leftJoinAndSelect(`note.${relation}`, `${relation}`);
		}
	}

	queryBuilder.take(options?.take).skip(options?.skip).orderBy({ "note.createdAt": "DESC" });
	return queryBuilder.getManyAndCount();
};

const deleteById = async (id: string) => {
	const ds = await dataSource();
	const noteRepository = ds.getRepository(Note);

	const note = await noteRepository.findOneOrFail({
		where: { id },
	});
	console.log("para eliminar note:", note);

	return noteRepository.softRemove(note);
};

export const noteRepository = {
	createNote,
	findNoteById: findById,
	updateNoteById: update,
	getAllNotes: getAll,
	deleteNoteById: deleteById,
};

export default noteRepository;
