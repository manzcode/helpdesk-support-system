import request from "supertest";
import dotenv from "dotenv";
dotenv.config();
import app, { Express } from "express";
import router from "../../routes/user.routes";
// Test the user routes using an Express app
describe("User routes", () => {
  let expressApp: Express;

  beforeAll(() => {
    expressApp = app();
    expressApp.use(router);
  });

  it("should get all tickets", async () => {
    const response = await request(expressApp).get("/all/tickets");
    expect(response.status).toBe(200);
  });

  it("should get an user ticket", async () => {
    const response = await request(expressApp).get(
      "/a/ticket?id=f70a7d52-cdcb-4f87-8f26-6d30f6e93e56"
    );
    expect(response.status).toBe(200);
  });

  it("should view a ticket", async () => {
    const response = await request(expressApp).get(
      "/show/ticket?id=3b2d7a9f-390d-41dd-942d-d75cd758d1ca"
    );
    expect(response.status).toBe(200);
  });
});
