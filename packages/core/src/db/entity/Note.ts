import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, BaseEntity } from "typeorm";

@Entity({ name: "note" })
export class Note extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({
		type: "varchar",
		length: 300,
		comment: "Unique name of the note",
	})
	name: string;

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
	created_at: Date;

	@UpdateDateColumn({
		type: "timestamp",
		nullable: true,
	})
	updated_at: Date | null;
}
