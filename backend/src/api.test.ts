import request from "supertest";
import app from "./app";
import { pool } from "./config/database";

const testUser = {
  email: "test@email.com",
  username: "testuser1234",
  password: "testtesttest1234...!"
};

describe("Auth Routes", () => {
  let token: string;
  let reviewId: number;
  const testGameId = 50;

  beforeAll(async () => {
    await deleteTestUser();

    const registerRes = await request(app)
      .post("/auth/register")
      .send(testUser);
    expect(registerRes.status).toBe(200);
    expect(registerRes.body.user).toBeDefined();

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await deleteTestUser();
  });

  describe("Reviews", () => {
    it("Should create a review", async () => {
      const reviewData = { rating: 5, review_text: "Awesome game!" };
      const res = await request(app)
        .post(`/games/${testGameId}/reviews`)
        .set("Authorization", `Bearer ${token}`)
        .send(reviewData);

      expect(res.status).toBe(201);
      expect(res.body.reviewid).toBeDefined();
      reviewId = res.body.reviewid;
    });

    it("Should delete the created review", async () => {
      const res = await request(app)
        .delete(`/games/${testGameId}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });
  });

  describe("Favorites", () => {
    it("Should favorite the game (201 or 200)", async () => {
      const res = await request(app)
        .post(`/users/favorite/${testGameId}`)
        .set("Authorization", `Bearer ${token}`);

      expect([200, 201]).toContain(res.status);
    });

    it("Should return 401 if Authorization header is missing", async () => {
      const res = await request(app)
        .post(`/users/favorite/${testGameId}`);

      expect(res.status).toBe(401);
    });
  });

  describe("Statuses", () => {
    it("Should return all statuses", async () => {
      const res = await request(app).get("/statuses");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { statusid: 1, status_name: "NotStarted" },
        { statusid: 2, status_name: "Playing" },
        { statusid: 3, status_name: "Completed" },
        { statusid: 4, status_name: "OnHold" },
        { statusid: 5, status_name: "Dropped" }
      ]);
    });
  });
});

export async function deleteTestUser() {
  await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
}
