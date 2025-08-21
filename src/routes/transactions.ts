import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../infra/database/prisma";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

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

      let sessionId = request.cookies.sessionId;
      if (!sessionId) {
        sessionId = randomUUID();
        reply.setCookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      await prisma.transaction.create({
        data: {
          amount,
          title,
          type,
          sessionId,
        },
      });

      return reply.status(201).send();
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:id",
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          data: z.object({
            id: z.uuid(),
            title: z.string(),
            amount: z.number(),
            type: z.enum(["CREDIT", "DEBIT"]),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },
    preHandler: [checkSessionIdExists],
    handler: async (request, reply) => {
      const { id } = request.params;

      const transaction = await prisma.transaction.findUnique({
        where: {
          id,
          sessionId: request.cookies.sessionId,
        },
        select: {
          id: true,
          title: true,
          amount: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!transaction) {
        return reply.status(404).send({ message: "Transaction not found." });
      }

      return reply.send({ data: transaction });
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      response: {
        200: z.object({
          data: z.array(
            z.object({
              id: z.uuid(),
              title: z.string(),
              amount: z.number(),
              type: z.enum(["CREDIT", "DEBIT"]),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          ),
        }),
      },
    },
    preHandler: [checkSessionIdExists],
    handler: async (request, reply) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          sessionId: request.cookies.sessionId,
        },
        select: {
          id: true,
          title: true,
          amount: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return reply.send({ data: transactions });
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/summary",
    schema: {
      response: {
        200: z.object({
          data: z.object({
            amount: z.number(),
          }),
        }),
      },
    },
    preHandler: [checkSessionIdExists],
    handler: async (request, reply) => {
      const { _sum } = await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
      });

      return reply.status(200).send({
        data: {
          amount: _sum.amount ?? 0,
        },
      });
    },
  });
};
