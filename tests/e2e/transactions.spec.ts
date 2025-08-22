import supertest from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../src/app";
import { prisma } from "../../src/infra/database/prisma";

describe("transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should create a new transaction", async () => {
    const response = await supertest(app.server).post("/transactions").send({
      title: "New transaction",
      amount: 1000,
      type: "CREDIT",
    });

    expect(response.statusCode).toEqual(201);
  });

  it("Should list all transactions", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 1000,
        type: "CREDIT",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");
    if (!cookies) {
      throw new Error("No cookies found");
    }

    const listTransactionsResponse = await supertest(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    expect(listTransactionsResponse.statusCode).toEqual(200);
    expect(listTransactionsResponse.body.data).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 1000,
      }),
    ]);
  });
});
