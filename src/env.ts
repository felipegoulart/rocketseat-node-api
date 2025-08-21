import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  COOKIE_SECRET: z.string(),
});

const { success, error, data: env } = envSchema.safeParse(process.env);

if (!success) {
  console.error("Invalid environment variables", z.prettifyError(error));

  throw new Error("Invalid environment variables");
}

export { env };
