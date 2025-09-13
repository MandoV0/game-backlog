import React from "react";
import "../styles/Game.css";
import { useNavigate } from "react-router-dom";

interface GameCardProps {
  name: string;
  image?: string;
}

const GameCard: React.FC<GameCardProps> = ({ name, image }) => {
  const navigate = useNavigate();

  return (
    <div className="game-card" onClick={() => {navigate("/game")}}>
      <div className="image-container">
        <img
          src={image || `https://placehold.co/300x400`}
          alt={name}
          className="game-cover-img"
        />
      </div>
      <div className="game-info-overlay">
        <h1 className="h1">{name}</h1>
      </div>
    </div>
  );
};

export default GameCard;