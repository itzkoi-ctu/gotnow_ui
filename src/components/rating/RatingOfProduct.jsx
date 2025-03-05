import React from "react";
import StarRatings from "react-star-ratings";
import { Card, Container, Image } from "react-bootstrap";

const RatingOfProduct = ({ ratings }) => {
    console.log("rating " + JSON.stringify(ratings));

    if (!ratings || ratings.length === 0) {
        return <p className="text-center text-muted">No reviews yet.</p>;
    }

    // Calculate average rating
    const avgRating = (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1);

    return (
        <Container className="mt-4">
            <h4 className="text-center mb-3">Product Reviews</h4>

            {/* Average Rating */}
            <div className="d-flex justify-content-center align-items-center mb-4">
                <StarRatings
                    rating={parseFloat(avgRating)}
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="25px"
                    starSpacing="3px"
                />
                <span className="ms-2 text-muted">({avgRating}/5 from {ratings.length} reviews)</span>
            </div>

            {ratings.map((review) => (
                <Card key={review.id} className="mb-3 shadow-sm border-0">
                    <Card.Body>
                        <div className="d-flex align-items-center">
                            {/* Hiển thị Avatar */}
                            <Image
                                src={review.avatarUrl || "https://via.placeholder.com/50"}
                                roundedCircle
                                width={50}
                                height={50}
                                className="me-3"
                            />
                            <div>
                                <h5 className="mb-1">{review.userName || "Anonymous User"}</h5>
                                <StarRatings
                                    rating={review.rating}
                                    starRatedColor="gold"
                                    numberOfStars={5}
                                    starDimension="20px"
                                    starSpacing="2px"
                                />
                            </div>
                        </div>
                        <p className="mt-2"><strong>Comment:</strong> {review.comment}</p>
                        <p className="text-muted small">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default RatingOfProduct;

// import React from "react";
// import StarRatings from "react-star-ratings";
// import { Card, Container } from "react-bootstrap";

// const RatingOfProduct = ({ ratings }) => {
//     console.log("rating " + JSON.stringify(ratings));

//     if (!ratings || ratings.length === 0) {
//         return <p className="text-center text-muted">No reviews yet.</p>;
//     }

//     // Calculate average rating
//     const avgRating = (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1);

//     return (
//         <Container className="mt-4">
//             <h4 className="text-center mb-3">Product Reviews</h4>
            
//             {/* Average Rating */}
//             <div className="d-flex justify-content-center align-items-center mb-4">
//                 <StarRatings
//                     rating={parseFloat(avgRating)}
//                     starRatedColor="gold"
//                     numberOfStars={5}
//                     starDimension="25px"
//                     starSpacing="3px"
//                 />
//                 <span className="ms-2 text-muted">({avgRating}/5 from {ratings.length} reviews)</span>
//             </div>

//             {ratings.map((review) => (
//                 <Card key={review.id} className="mb-3 shadow-sm border-0">
//                     <Card.Body>
//                         <h5 className="mb-1">{review.userName || "Anonymous User"}</h5>
//                         <StarRatings
//                             rating={review.rating}
//                             starRatedColor="gold"
//                             numberOfStars={5}
//                             starDimension="20px"
//                             starSpacing="2px"
//                         />
//                         <p className="mt-2"><strong>Comment:</strong> {review.comment}</p>
//                         <p className="text-muted small">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
//                     </Card.Body>
//                 </Card>
//             ))}
//         </Container>
//     );
// };

// export default RatingOfProduct;
