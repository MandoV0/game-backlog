import { useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { createReview } from "../api/Client";

interface ReviewFormProps {
    gameId: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ gameId }) => {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [error, setError] = useState("");

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (body: { gameId: number, rating: number, title: string, reviewText: string }) => createReview(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", gameId] });
            setTitle("");
            setRating(0);
            setReviewText("");
        },
        onError: (err: any) => setError(err.message),
    });

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    mutation.mutate({ gameId, rating, title, reviewText });
                }}
            >
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Review Title"
                />
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review"
                />
                <input
                    type="number"
                    min={1}
                    max={10}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                />
                <button type="submit">Submit Review</button>
            </form>
        </>
    );
}

export default ReviewForm;