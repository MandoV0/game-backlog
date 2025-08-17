import React from 'react';
import GameReview, {ReviewComment} from './GameReview';
import { GameReview as ApiGameReview } from '../hooks/useGameReviews';
import '../styles/Cards.css';

export interface ReviewListProps {
  reviews: ApiGameReview[];
}

const ReviewList: React.FC<ReviewListProps>= ({ reviews }) => {
  console.log("Reviews in ReviewList:", reviews);
  return (
    <div className='review-list'>
      {reviews.map((review, id) => (
        <GameReview key = {id} review={review}></GameReview>
      ))}
    </div>
  )
};

export default ReviewList