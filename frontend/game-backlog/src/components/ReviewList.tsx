import React from 'react';
import GameReview, {ReviewComment} from './GameReview';
import '../styles/Cards.css';

export interface ReviewListProps {
  reviews: ReviewComment[];
}

const ReviewList: React.FC<ReviewListProps>= ({ reviews }) => {
  return (
    <div className='review-list'>
      {reviews.map((review, id) => (
        <GameReview key = {id} review={review}></GameReview>
      ))}
    </div>
  )
};

export default ReviewList