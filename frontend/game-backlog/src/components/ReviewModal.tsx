import React, { useState, useEffect } from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  onSubmit: (rating: number, reviewText: string) => Promise<void>;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  gameTitle,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(1);
  const [reviewText, setReviewText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit(rating, reviewText);
      onClose();
      setRating(1);
      setReviewText("");
    } catch (err: any) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <h2>Review for {gameTitle}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Rating (1-5):
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              disabled={submitting}
            />
          </label>
          <label>
            Review:
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={submitting}
            />
          </label>

          {error && <div style={{ color: "red" }}>{error}</div>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
