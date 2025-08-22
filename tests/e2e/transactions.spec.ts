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

  it("Should get a specific transaction by id", async () => {
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

    const transactionId = listTransactionsResponse.body.data[0].id;

    const getTransactionResponse = await supertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies);

    expect(getTransactionResponse.statusCode).toEqual(200);
    expect(getTransactionResponse.body.data).toEqual(
      expect.objectContaining({
        title: "New transaction",
        amount: 1000,
      }),
    );
  });

  it("Should get the summary", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "Credit transaction",
        amount: 1000,
        type: "CREDIT",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");
    if (!cookies) {
      throw new Error("No cookies found");
    }

    await supertest(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Debit transaction",
        amount: 500,
        type: "DEBIT",
      });

    const summaryResponse = await supertest(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies);

    expect(summaryResponse.statusCode).toEqual(200);
    expect(summaryResponse.body.data).toEqual(
      expect.objectContaining({
        amount: 500,
      }),
    );
  });
});
