import * as userRepo from '../repositories/user.repository';
import { User, UserGame, GameStatus, Review } from '../models/user.model';
import { PaginatedResult } from '../models/pagination.dto';
import { UserGameWithDetails, UserProfile } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Check if user already exists
  const existingUser = await userRepo.getUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await userRepo.createUser(username, email, passwordHash);

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  return { user, token };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const user = await userRepo.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  return { user, token };
};

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  return await userRepo.getUserProfile(userId);
};

export const getUserBacklog = async (
  userId: number,
  status?: GameStatus,
  limit: number = 10,
  offset: number = 0
): Promise<PaginatedResult<UserGame>> => {
  const { games, count } = await userRepo.getUserBacklog(userId, status, limit, offset);

  return {
    count,
    results: games,
  };
};

export const addGameToBacklog = async (
  userId: number,
  gameId: number,
  status: GameStatus = 'backlog'
): Promise<UserGame> => {
  return await userRepo.addGameToBacklog(userId, gameId, status);
};

export const updateGameStatus = async (
  userId: number,
  gameId: number,
  status: GameStatus,
  rating?: number,
  startedAt?: string,
  finishedAt?: string
): Promise<UserGame> => {
  return await userRepo.updateGameStatus(userId, gameId, status, rating, startedAt, finishedAt);
};

export const removeGameFromBacklog = async (
  userId: number,
  gameId: number
): Promise<void> => {
  return await userRepo.removeGameFromBacklog(userId, gameId);
};

export const getUserReviews = async (
  userId: number,
  limit: number = 10,
  offset: number = 0
): Promise<PaginatedResult<Review>> => {
  const { reviews, count } = await userRepo.getUserReviews(userId, limit, offset);

  return {
    count,
    results: reviews,
  };
};

export const createReview = async (
  userId: number,
  gameId: number,
  title?: string,
  content?: string,
  rating?: number
): Promise<Review> => {
  return await userRepo.createReview(userId, gameId, title, content, rating);
};

export const updateReview = async (
  userId: number,
  gameId: number,
  title?: string,
  content?: string,
  rating?: number
): Promise<Review> => {
  return await userRepo.updateReview(userId, gameId, title, content, rating);
};

export const deleteReview = async (
  userId: number,
  gameId: number
): Promise<void> => {
  return await userRepo.deleteReview(userId, gameId);
};

export const logPlaytime = async (
  userId: number,
  gameId: number,
  playtimeMinutes: number,
  notes?: string
): Promise<UserGame> => {
  return await userRepo.logPlaytime(userId, gameId, playtimeMinutes, notes);
};

export const getPlaytimeStats = async (userId: number) => {
  return await userRepo.getPlaytimeStats(userId);
};
