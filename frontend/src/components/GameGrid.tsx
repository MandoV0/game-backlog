import React from "react";
import GameCard from "./GameCard";
import "../styles/Game.css";

interface Game {
  id: number;
  name: string;
  image?: string;
}

interface GameGridProps {
  games: Game[];
}

const GameGrid: React.FC<GameGridProps> = ({ games }) => (
  <div className="game-grid">
    {games.map((game) => (
      <GameCard key={game.id} name={game.name} image={game.image} />
    ))}
  </div>
);

export default GameGrid;