import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/GameDetails.css";

export interface Game {
  id: number;
  name: string;
  image?: string;
  description?: string;
  releaseDate?: string;
  genre?: string;
  platform?: string;
}

const GameDetailsPage: React.FC = () => {
  return (
   <>
    <Header />
    <div className="game-details-container">
      <h1>Game Details</h1>
      <p>Select a game to see its details.</p>
    </div>
   </>
  );
};

export default GameDetailsPage;