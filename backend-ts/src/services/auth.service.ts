import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepo from "../repositories/auth.repository";
import { ApiError } from "../utils/error";
import { User } from "../models/user.model";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser(username: string, email: string, password: string) {
  const existing = await authRepo.getUserByEmail(email);
  if (existing) throw new ApiError(409, "Email already exists");

  const existUsername = await authRepo.getUserByUsername(username);
  if (existUsername) throw new ApiError(409, "Username already exists");

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await authRepo.createUser(email, username, hashed);
  return generateToken(user);
}

export async function loginUser(email: string, password: string) {
  const user = await authRepo.getUserByEmail(email);
  if (!user) throw new ApiError(404, "Email or password is incorrect");

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new ApiError(404, "Email or password is incorrect");

  return generateToken(user);
}

function generateToken(user: User) {
  const payload = { id: user.userid, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return { token, user: { id: user.userid, username: user.username, email: user.email } };
}