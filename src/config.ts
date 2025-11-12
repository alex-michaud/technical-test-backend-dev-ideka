import { z } from "zod";

const _config = z.object({
	API_PORT: z
		.string()
		.optional()
		.default("3000")
		.transform((val) => parseInt(val)),
	DATABASE_URL: z.string().default("sqlite://:memory:"),
});

type Config = z.infer<typeof _config>;

export const config: Config = _config.parse(process.env);
