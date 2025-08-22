import request from "supertest";
import app from "./app";

describe("Auth Routes", () => {
  let token: string;

  it("Should login and return a JWT Token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "jonwolf2@email.com", password: "1234" });

    console.log("Response body:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  let reviewId: number;
  let testGameId: number = 50;

  it("Should delete the review if it exists, should return 204 either way", async () => {
    const res = await request(app)
      .delete(`/games/${testGameId}/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${token}`);
    console.log("Response body:", res.body);
    expect(res.status).toBe(204);
  });

  it("Should create a review", async () => {
    const reviewData = {
      rating: 5,
      review_text: "Awesome game!"
    };

    const res = await request(app)
      .post(`/games/${testGameId}/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send(reviewData);

    console.log("Response body:", res.body);
    reviewId = res.body.reviewid;
    console.log("Created review ID:", reviewId);
    expect(res.status).toBe(201);
  });

  it("Should delete the created review", async () => {
    const res = await request(app)
      .delete(`/games/${testGameId}/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${token}`);
    console.log("Response body:", res.body);
    expect(res.status).toBe(204);
  });

  it("Should favorite the game 201 or 200 if the game is already favorited (Does nothing)", async () => {
    const res = await request(app)
      .post(`/users/favorite/${testGameId}`)
      .set("Authorization", `Bearer ${token}`);
    console.log("Response body:", res.body);
    expect([200, 201]).toContain(res.status);
  });

  it("Should return 401 as we do not Pass an Authorization header", async () => {
    const res = await request(app)
      .post(`/users/favorite/${testGameId}`);
    console.log("Response body:", res.body);
    expect(res.status).toBe(401);
  });

  /*
  it("Should return 1 favorite", async () => {
    const res = await request(app)
      .get(`/users/${userId}/favorites`)
      .set("Authorization", `Bearer ${token}`);
    console.log("Response body:", res.body);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ games: [testGameId] });
  });
  */

});