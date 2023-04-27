import * as dotenv from "dotenv";
import { DataSourceOptions } from "typeorm";
import { DataSource } from "typeorm";

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
	entities: ["../entity/*{.ts,.js}"],
	migrations: ["../migration/*{.ts,.js}"],
	migrationsRun: false,
};

export default config;
