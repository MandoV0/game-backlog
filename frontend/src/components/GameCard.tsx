import React from "react";
import "../styles/Game.css";
import { useNavigate } from "react-router-dom";
import type { GameAPIData } from "../api/Games";

interface GameCardProps {
    game: GameAPIData;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
    const navigate = useNavigate();

    return (
        <div className="game-card" onClick={() => { navigate(`/game/${game.id}`) }}>
            <div className="image-container">
                <img
                    src={game.images ? game.images[0].url : `https://placehold.co/300x400`}
                    alt={game.title}
                    className="game-cover-img"
                />
            </div>
            <div className="game-info-overlay">
                <h1 className="h1">{game.title}</h1>
            </div>
        </div>
    );
};

export default GameCard;