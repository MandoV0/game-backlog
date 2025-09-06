export interface Game {
  id: number;
  title: string;
  release_year: number;
  created_at: Date;
  updated_at: Date;
}

export interface Platform {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GameImage {
  id: number;
  game_id: number;
  url: string;
  type: string;
  description?: string;
}