import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
dotenv.config();

const config: DataSourceOptions = {
	type: process.env.DB_TYPE === "mysql" ? process.env.DB_TYPE : "mysql",
	host: process.env.DB_HOST,
	port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: false,
	logging: false,
	entities: ["./packages/core/src/db/entity/!index.{ts,js}"],
	migrations: ["./packages/core/src/db/migrations/*{.ts,.js}"],
	migrationsRun: false,
};

export default new DataSource(config);
