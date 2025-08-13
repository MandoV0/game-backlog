import React, { useState } from "react";
import { GameCard, GameCardProps } from "./GameCard";
import { Game } from '../pages/Home';
import '../styles/Layout.css';

interface GamesProps {
  games: Game[];
}

export const GameContainer: React.FC<GamesProps> = ({ games }) => {
  return (
    <div className="gamecard-grid">
      {games.map((game, index) => (
        <GameCard
          gameid={game.gameid}
          title={game.title}
          description={game.description}
          genres={game.genres}
          imageUrl={game.images[0]}
          isFavorite={game.isFavorite}
          key={index}
        />
      ))}
    </div>
  );
};
