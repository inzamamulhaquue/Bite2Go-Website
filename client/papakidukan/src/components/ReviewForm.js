import React, { useState } from "react";
import "../styles/ReviewForm.css";
import { useParams } from "react-router-dom";

const ReviewForm = ({ onReviewSubmit }) => {
    const { productId } = useParams();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const review = { productId, rating, comment };
        try {
            const response = await fetch("http://localhost:5005/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(review),
            });

            const data = await response.json();
            if (data.success) {
                alert("Review submitted successfully!");
                onReviewSubmit(data.review);
                setRating(5);
                setComment("");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h3>Leave a Review</h3>
            
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
                {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>{num} ⭐</option>
                ))}
            </select>

            <label>Comment:</label>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                required
            />

            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewForm;
