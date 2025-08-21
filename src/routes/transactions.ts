import crypto from "node:crypto";
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import z from "zod";
import { prisma } from "../infra/database/prisma";

export const transactionRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
) => {
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = bodySchema.parse(request.body);

    await prisma.transaction.create({
      data: {
        amount,
        title,
        type,
        sessionId: crypto.randomUUID(),
      },
    });

    return reply.status(201).send();
  });
};
