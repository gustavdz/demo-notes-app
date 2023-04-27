import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Test1682564759125 implements MigrationInterface {
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
						name: "name",
						type: "varchar",
						isNullable: false,
					},
					{
						name: "attachment",
						type: "varchar",
						isNullable: false,
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
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("note");
	}
}
