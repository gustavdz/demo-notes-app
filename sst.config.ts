import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";
import { StorageStack } from "./stacks/StorageStack";
import { AuthStack } from "./stacks/AuthStack";
import { FrontendStack } from "./stacks/FrontendStack";

export default {
	config(_input) {
		return {
			name: "notes",
			region: "us-east-1",
		};
	},
	stacks(app) {
		app.stack(StorageStack).stack(ApiStack).stack(AuthStack).stack(FrontendStack);
	},
} satisfies SSTConfig;
