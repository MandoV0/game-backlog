import { Game } from "./game.model";

export interface GameImage {
  imageid: number;
  url: string;
}

export interface GameGenre {
  genreid: number;
  name: string;
}

export interface GameResponse extends Game {
  images?: GameImage[];
  genres?: GameGenre[];
  isFavorite?: boolean; /* If user is logged in and this game is a favorite */
}