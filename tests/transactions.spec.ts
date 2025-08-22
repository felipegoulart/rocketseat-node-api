import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app } from "../src/app";

beforeAll(async () => {
  await app.ready();
});

describe("transactions routes", () => {
  it("Should create a new transaction", async () => {
    const response = await supertest(app.server).post("/transactions").send({
      title: "New transaction",
      amount: 1000,
      type: "CREDIT",
    });

    expect(response.statusCode).toEqual(201);
  });
});
