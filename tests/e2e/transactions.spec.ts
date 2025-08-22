import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../src/app";

describe("transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
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

  
});
