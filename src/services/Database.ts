import { config } from "../config";

// Provide a minimal Prisma client wrapper. The project uses Prisma v6 which
// exposes the client through the `@prisma/client` package at runtime.
// Keep this file small and lazy-initialize a singleton client so tests or
// other code can import `Database.client` if they want database access.

import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

let client: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
	if (!client) {
		client = new PrismaClient({
			datasources: {
				db: { url: config.DATABASE_URL },
			},
		});
	}
	return client;
}

export default getPrismaClient();
