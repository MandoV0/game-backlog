import React from "react";
import "../styles/GameReview.css";

export interface ReviewProps {
  totalReviews: number;
  oneStarReviews: number;
  twoStarReviews: number;
  threeStarReviews: number;
  fourStarReviews: number;
  fiveStarReviews: number;
  avgReview: number;
}

const ReviewCard: React.FC<{ review: ReviewProps }> = ({ review }) => {
  const getPercentage = (count: number) => {
    return review.totalReviews > 0 ? (count / review.totalReviews) * 100 : 0;
  };

  const ratings = [
    { stars: "★★★★★", count: review.fiveStarReviews },
    { stars: "★★★★☆", count: review.fourStarReviews },
    { stars: "★★★☆☆", count: review.threeStarReviews },
    { stars: "★★☆☆☆", count: review.twoStarReviews },
    { stars: "★☆☆☆☆", count: review.oneStarReviews },
  ];

  return (
    <div className="review-card">
      <h3>Avg Rating</h3>
      <div className="avg-score">{review.avgReview}</div>
      {ratings.map((rating, id) => (
        <div className="review-row" key={id}>
          <span className="stars">{rating.stars}</span>
          <div className="review-bar">
            <div
              className="review-fill"
              style={{ width: `${getPercentage(rating.count)}%` }}
            ></div>
          </div>
        </div>
      ))}
      Total Reviews: {review.totalReviews}
    </div>
  );
};

export default ReviewCard;
