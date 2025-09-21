import { useState } from "react";
import "../styles/GameDetails.css";
import { getReviews, type GameReviewResponse } from "../api/Games";
import { getUserReviewByGameId, deleteReview } from "../api/Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReviewForm from "./ReviewForm";
import Review from "./Review";
import Pagination from "./Pagination";
import { getCurrentUserId } from "../helpers/JwtHelper";

const REVIEWS_PER_PAGE = 10;

interface ReviewListProps {
    gameId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ gameId }) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState<any>(null);
    const [page, setPage] = useState(1);
    const currentUserId = getCurrentUserId();
    const queryClient = useQueryClient();

    const { data: userReviewData } = useQuery({
        queryKey: ["userReview", gameId],
        queryFn: () => getUserReviewByGameId(gameId),
        enabled: !!currentUserId,
    });

    const userReview = userReviewData?.data;
    const userHasReviewed = !!userReview;

    const { data, isLoading, error } = useQuery<GameReviewResponse, Error>({
        queryKey: ["reviews", gameId, page],
        queryFn: async () => {
            const res = await getReviews(gameId, REVIEWS_PER_PAGE, (page - 1) * REVIEWS_PER_PAGE);
            return res;
        },
    });

    const deleteReviewMutation = useMutation({
        mutationFn: async (gameId: number) => {
            await deleteReview(gameId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userReview", gameId] });
            queryClient.invalidateQueries({ queryKey: ["reviews", gameId] });
        },
        onError: (err: any) => {
            console.error("Failed to delete user review:", err);
            alert("Failed to delete user review");
        },
    });

    const handleEditReview = (review: any) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (gameId: number) => {
        if (window.confirm("Are you sure you want to delete your review?")) {
            try {
                await deleteReviewMutation.mutateAsync(gameId);
            } catch (error) {
                console.error("Failed to delete users review:", error);
            }
        }
    };

    const handleCancelEdit = () => {
        setShowReviewForm(false);
        setEditingReview(null);
    };

    const handleSuccess = () => {
        setShowReviewForm(false);
        setEditingReview(null);
    };

    if (isLoading) return <p>Loading reviews...</p>;
    if (error) return <p>Error loading reviews: {error.message}</p>;

    const totalReviews: number = data?.data.count || 0;
    const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

    return (
        <div className="review-section">
            <h2>User Reviews</h2>

            {currentUserId && (
                <div className="review-actions">
                    {!userHasReviewed ? (
                        <button
                            className="review-btn"
                            onClick={() => setShowReviewForm(true)}
                        >
                            Write a Review
                        </button>
                    ) : (
                        <div className="user-review-actions">
                            <button
                                className="edit-review-btn"
                                onClick={() => handleEditReview(userReview)}
                            >
                                Edit My Review
                            </button>
                            <button
                                className="delete-review-btn"
                                onClick={() => handleDeleteReview(gameId)}
                                disabled={deleteReviewMutation.isPending}
                            >
                                {deleteReviewMutation.isPending ? "Deleting..." : "Delete My Review"}
                            </button>
                        </div>
                    )}
                </div>
            )}
            {showReviewForm && (
                <ReviewForm
                    gameId={gameId}
                    editingReview={editingReview}
                    onCancel={handleCancelEdit}
                    onSuccess={handleSuccess}
                />
            )}

            <ul className="review-list">
                {(data?.data.results || []).map((review) => (
                    <Review
                        key={review.id}
                        reviewId={review.id}
                        gameId={gameId}
                        username={review.username}
                        userId={review.user_id}
                        reviewTitle={review.title}
                        reviewContent={review.content}
                        reviewRating={review.rating}
                        reviewDate={review.created_at}
                    />
                ))}
            </ul>

            <Pagination onPageChange={setPage} page={page} totalPages={totalPages} />
        </div>
    );
};

export default ReviewList;