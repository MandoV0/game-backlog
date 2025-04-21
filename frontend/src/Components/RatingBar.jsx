import React from 'react';
import "../Styles/Games.css";

const RatingBar = ({ maxStars = 10 }) => {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(null);

  const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

  return(
    <div>
      {stars.map(star => (
        <span key={star}
        className={`star ${(hoverRating || rating) >= star ? 'filled' : 'empty'}`}
        onClick={
          () => setRating(star)
        }
        onMouseEnter={
          () => setHoverRating(star)
        }
        onMouseLeave={
          () => setHoverRating(null)
        }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingBar;