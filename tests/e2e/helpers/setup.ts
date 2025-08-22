import { execSync } from "node:child_process";
import { afterAll, beforeAll } from "vitest";

beforeAll(async () => {
  console.log("Up the database... 🚀");
  execSync("docker compose up -d db-tests");

  // Espera o banco de dados estar pronto para conexões
  console.log("Waiting for database is ready...");
  execSync(
    "sh -c 'while ! docker compose exec -T db-tests pg_isready --host=localhost; do sleep 1; done'",
    {
      stdio: "inherit",
    },
  );
  console.log("Database is ready! ✨");

  execSync("pnpm prisma migrate deploy");
});

afterAll(async () => {
  execSync("docker compose down db-tests");
});
