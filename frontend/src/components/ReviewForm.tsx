import { useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { createReview, updateReview, type UserGameReviewData } from "../api/Client";

interface ReviewFormProps {
    gameId: number;
    editingReview?: UserGameReviewData | null;
    onCancel?: () => void;
    onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ gameId, editingReview, onCancel, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [error, setError] = useState("");

    const queryClient = useQueryClient();
    
    useEffect(() => {
        if (editingReview) {
            setTitle(editingReview.title || "");
            setRating(editingReview.rating + "" || "");
            setReviewText(editingReview.content || "");
        } else {
            setTitle("");
            setRating("");
            setReviewText("");
        }
    }, [editingReview]);

    const mutation = useMutation({
        mutationFn: (body: { gameId: number, rating: number, title: string, reviewText: string }) => 
            editingReview ? updateReview(body) : createReview(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", gameId] });
            queryClient.invalidateQueries({ queryKey: ["userReview", gameId] });
            if (onSuccess) onSuccess();
        },
        onError: (err: any) => setError(err.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const numberRating = Number(rating);

        if (!title.trim() || !reviewText.trim() || numberRating < 1 || numberRating > 10) {
            setError("Please fill in all fields with valid values");
            return;
        }

        mutation.mutate({ gameId, rating: numberRating, title, reviewText });
    };

    return (
        <div className="review-form-container">
            <h3>{editingReview ? "Edit Your Review" : "Write a Review"}</h3>
            
            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label htmlFor="title">Review Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your review a title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rating">Rating (1-10)</label>
                    <input
                        id="rating"
                        type="number"
                        min={1}
                        max={10}
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="Rate this game"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Review Content</label>
                    <textarea
                        id="content"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about this game..."
                        rows={5}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                    <button 
                        type="submit" 
                        disabled={mutation.isPending}
                        className="submit-btn"
                    >
                        {mutation.isPending 
                            ? "Saving..." 
                            : editingReview 
                                ? "Update Review" 
                                : "Submit Review"
                        }
                    </button>
                    
                    {onCancel && (
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;