import { server } from "./server";
import { config } from "./config";

server.listen(config.API_PORT, () => {
	console.log(`Server is running on port ${config.API_PORT}`);
});
