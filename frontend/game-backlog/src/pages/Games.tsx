import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Games.css";
import { getGameById, postReview } from "../services/API";
import { useGame } from "../hooks/useGame";
import ReviewModal from "../components/ReviewModal";

export const Games = () => {
  const { gameid } = useParams<{ gameid: string }>();
  const { game, loading, error } = useGame(gameid);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (loading) return <div>Loading game info...</div>;
  if (error) return <div>{error}</div>;
  if (!game) return <div>No game found.</div>;

  const handleReviewSubmit = (rating: number, reviewText: string) => {
    if (!gameid) {
      console.error("Missing gameid, can't post review");
      return;
    }
    postReview(gameid, rating, reviewText);
    setIsModalOpen(false);
  };

  return (
    <div className="games-container">
      <div className="left-div">
        <img
          src={game.images?.[0] || "https://placehold.co/400x700"}
          alt={game.title}
          className="game-image"
        />
      </div>
      <div className="right-div">
        <div className="game-info-container">
          <h1>{game.title}</h1>
          <p>Release Info</p>
          <p>
            Game Description Game Description Game Description Game Description
            Game Description{" "}
          </p>
          <span>{game.genres?.join(", ")}</span>
          <button onClick={() => setIsModalOpen(true)}>Write a Review</button>
        </div>
      </div>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gameTitle={game.title}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};
