import React from "react";
import GameCard from "./GameCard";
import "../styles/Game.css";
import type { GameAPIData } from "../api/Games";

interface GameGridProps {
  games: GameAPIData[];
}

const GameGrid: React.FC<GameGridProps> = ({ games }) => (
  <div className="game-grid">
    {games.map((game) => (
      <GameCard key={game.id} game={game} />
    ))}
  </div>
);

export default GameGrid;