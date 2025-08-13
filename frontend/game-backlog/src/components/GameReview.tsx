import React from "react";
import '../styles/GameReview.css';

export interface ReviewComment {
  username: string;
  userid?: number;
  rating: number;
  comment: string;
  date: string;
}

/* Fake Reviews for testing */
export const reviews: ReviewComment[] = [
  {
    username: "Alice",
    rating: 5,
    comment: "Absolutely loved it! Fast shipping and great quality.",
    date: "2025-08-10",
  },
  {
    username: "Bob",
    rating: 3,
    comment: "It's okay, but not what I expected for the price.",
    date: "2025-08-08",
  },
  {
    username: "Charlie",
    rating: 4,
    comment: "Solid purchase. Would buy again.",
    date: "2025-08-05",
  },
];

interface GameReviewProps {
  review: ReviewComment;
}

const GameReview: React.FC<GameReviewProps> = ({ review }) => {
  return (
    <div className="game-review-container">
      {review.username} : {review.rating} Stars
      <p>{review.comment}</p>
      <small>{review.date}</small>
    </div>
  )
}

export default GameReview;