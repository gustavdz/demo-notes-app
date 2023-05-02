import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNoteTable1682715036768 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "note",
				columns: [
					{
						name: "id",
						type: "varchar",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "uuid",
					},
					{
						name: "userId",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "name",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "content",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "attachment",
						type: "varchar",
						isNullable: true,
					},
					{
						name: "createdAt",
						type: "datetime",
						default: "now()",
					},
					{
						name: "updatedAt",
						type: "datetime",
						default: "now()",
						onUpdate: "now()",
					},
					{
						name: "deletedAt",
						type: "datetime",
						isNullable: true,
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("note");
	}
}
