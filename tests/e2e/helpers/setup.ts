import { execSync } from "node:child_process";
import { afterAll, beforeAll } from "vitest";

beforeAll(() => {
  console.log("Up the database... 🚀");
  execSync("docker compose up -d db-tests");

  console.log("Waiting for database is ready...");
  execSync(
    "sh -c 'while ! docker compose exec -T db-tests pg_isready --host=localhost; do sleep 1; done'",
    {
      stdio: "inherit",
    },
  );
  console.log("Database is ready! ✨");

  execSync("pnpm prisma migrate deploy");
  console.log("Database migrated! ✨");
  console.log("Starting tests... 🚀");
});

afterAll(() => {
  console.log("Stopping tests... 🚀");
  execSync("docker compose down -v");
});
console.log("Database stopped! ✨");
