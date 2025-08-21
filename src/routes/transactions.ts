import crypto from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../infra/database/prisma";

export const transactionRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      body: z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(["CREDIT", "DEBIT"]),
      }),
    },
    handler: async (request, reply) => {
      const { title, amount, type } = request.body;

      await prisma.transaction.create({
        data: {
          amount,
          title,
          type,
          sessionId: crypto.randomUUID(),
        },
      });

      return reply.status(201).send();
    },
  });
};
