import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, BaseEntity, DeleteDateColumn } from "typeorm";

@Entity({ name: "note" })
export default class Note extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({
		type: "varchar",
		length: 300,
		comment: "Unique cognito user's id",
	})
	userId: string;

	@Column({
		type: "varchar",
		length: 300,
		comment: "Unique name of the note",
	})
	name: string;

	@Column({
		type: "varchar",
		length: 300,
		comment: "Unique name of the note",
	})
	content: string;

	@Column({
		type: "varchar",
		length: 300,
		comment: "name of the attached file",
	})
	attachment: string;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	createdAt: Date;

	@UpdateDateColumn({
		type: "timestamp",
		nullable: true,
	})
	updatedAt: Date | null;

	@DeleteDateColumn({
		type: "timestamp",
		nullable: true,
		name: "deletedAt",
	})
	delete: Date | null;
}
