import request from "supertest";
import app from "./app";

describe("Auth Routes", () => {
  let token: string;

  it("Should login and return a JWT Token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "jonwolf2@email.com", password: "1234" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("Should create a review", async () => {
    const reviewData = {
      rating: 5,
      review_text: "Awesome game!"
    };

    const res = await request(app)
      .post("/games/42/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send(reviewData);
    expect(res.status).toBe(201);
  });

  it("Should delete the created review", async () => {
    const res = await request(app)
      .delete("/games/42/reviews/2601")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});