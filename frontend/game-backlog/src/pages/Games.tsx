import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGame } from "../hooks/useGame";
import { useReview } from "../hooks/useReview";
import ReviewModal from "../components/ReviewModal";
import ReviewCard from "../components/ReviewCard";
import { useReviewAction } from "../hooks/useReviewAction";
import "../styles/Games.css";
import ReviewList from "../components/ReviewList";

import GameReview, { reviews } from "../components/GameReview"; /* JUST FOR TESTING */

export const Games = () => {
  const { gameid } = useParams<{ gameid: string }>();
  const { game, loading: gameLoading, error: gameError } = useGame(gameid);
  const { review, loading: reviewLoading, error: reviewError} = useReview(gameid);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { submitReview } = useReviewAction(gameid);

  if (gameLoading || reviewLoading) return <div>Loading game info...</div>;
  if (gameError || reviewError) return <div>{gameError} Error</div>;
  if (!game) return <div>No game found.</div>;

  return (
    <div className="games-container">
      <div className="left-div">
        <img
          src={game.images?.[0] || "https://placehold.co/400x700"}
          alt={game.title}
          className="game-image"
        />
        {review && (
          <ReviewCard
            review={review}
          />
        )}
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
        <ReviewList reviews={reviews}></ReviewList>
      </div>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gameTitle={game.title}
        onSubmit={async (rating, text) => {
          await submitReview(rating, text);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
