import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, postReview } from "../../store/features/ratingSlice";
import StarRatings from "react-star-ratings";
import { toast, ToastContainer } from "react-toastify";

const WriteReviewButton = ({ orderId, productId }) => {
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();
    // const user = useSelector((state) => state.user.user); 
    const userId= localStorage.getItem("userId")
    console.log(" id"+ userId)
    const handleSubmit = async () => {
        if (!rating || !comment.trim()) {
            toast.warning("Please enter a rating and select the number of stars!");
            return;
        }

        await dispatch(postReview({ orderId, userId, productId, rating, comment }));
        await dispatch(fetchReviews(productId)); // Gọi API cập nhật danh sách review

        toast.success("Added review successfully!")
        setShow(false);
    };

    return (
        <>
        <ToastContainer/>
            <Button variant="primary" onClick={() => setShow(true)}>Write a Review</Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Write a Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Rating:</Form.Label>
                            <StarRatings
                                rating={rating}
                                starRatedColor="gold"
                                changeRating={setRating}
                                numberOfStars={5}
                                name="rating"
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Comment:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Please share your feelings..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit}>Submit Review</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default WriteReviewButton;
