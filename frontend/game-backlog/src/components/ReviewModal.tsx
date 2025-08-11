import React, { useState, useEffect} from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  onSubmit: (rating: number, reviewText: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, gameTitle, onSubmit}) => {
  const [rating, setRating] = useState<number>(1);
  const [reviewText, setReviewText] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, reviewText);
  };

  return (
    <div onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        <h2>Review for {gameTitle}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Rating (1-5):
            <input type="number" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))}/>
          </label>
          <label>
            Review:
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}/>
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;