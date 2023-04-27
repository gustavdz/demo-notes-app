import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config/config";
let connected: DataSource;
const connectToDB = async (): Promise<DataSource> => {
	if (connected?.isInitialized) {
		return connected;
	}
	try {
		const appDataSource = new DataSource(config);
		connected = await appDataSource.initialize();
		return appDataSource;
	} catch (e: any) {
		if (e instanceof Error) {
			throw new Error(e.message);
		}
		throw new Error(e.message || "Internal server error");
	}
};

export default connectToDB;
