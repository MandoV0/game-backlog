export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export type GameStatus = 'backlog' | 'playing' | 'completed' | 'dropped';

export interface UserGame {
  id: number;
  user_id: number;
  game_id: number;
  status: GameStatus;
  rating?: number;
  started_at?: string;
  finished_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  game_id: number;
  title?: string;
  content?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}