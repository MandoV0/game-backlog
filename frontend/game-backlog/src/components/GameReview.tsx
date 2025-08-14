import React from "react";
import '../styles/Cards.css';
import { GameReview as ApiGameReview } from '../hooks/useGameReviews';

export interface ReviewComment {
  username: string;
  userid?: number;
  rating: number;
  comment: string;
  date: string;
}

interface GameReviewProps {
  review: ApiGameReview;
}

const GameReview: React.FC<GameReviewProps> = ({ review }) => {
  return (
    <div className="game-review-container">
      <div className="review-header">
        <span>{review.username}</span>
        <span className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
      </div>
      <p className="review-comment">{review.review_text}</p>
      <small>{new Date(review.review_date).toLocaleDateString()}</small>
    </div>
  )
}

export default GameReview;