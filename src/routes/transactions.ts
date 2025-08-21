import type { FastifyInstance, FastifyPluginAsync } from "fastify";

export const transactionRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
) => {
  app.get("/hello", () => {
    return "Hello World";
  });
};
