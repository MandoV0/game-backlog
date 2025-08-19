import { Request, Response } from "express";
import { getPaginatedGames } from "../services/game.service";

export async function getGamesController(req: Request, res: Response) {
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

  const result = await getPaginatedGames(page, pageSize);
  res.json(result);
}
