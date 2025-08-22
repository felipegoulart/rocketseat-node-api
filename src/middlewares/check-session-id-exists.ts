import type { FastifyReply, FastifyRequest } from "fastify";

export function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) {
  const sessionId = request.cookies.sessionId;
  if (!sessionId) {
    reply.code(401).send({
      error: "Unauthorized",
      message: "Session ID cookie is missing",
      statusCode: 401,
    });
    return;
  }

  done();
}
