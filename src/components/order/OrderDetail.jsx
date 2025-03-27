import React, { useEffect } from "react";
import { Card, Button, Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../store/features/orderSlice";
import { useParams } from "react-router-dom";
import ImageZoomify from "../common/ImageZoomify";
import WriteReviewButton from "../rating/Rating";

const OrderDetail = () => {
    const { orderId } = useParams();
    const order = useSelector((state) => state.order.orderDetail);
    const dispatch = useDispatch();

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderById(orderId));
        }
    }, [dispatch, orderId]);

    if (!order || !order.items) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center text-primary">Order Details</h2>
            
            {/* Thông tin đơn hàng */}
            <Card className="mb-4 p-4 shadow-lg border-primary">
                <Card.Body>
                    <Card.Title className="text-dark">🛒 Order ID: <strong>{order.id}</strong></Card.Title>
                    <p><strong>📅 Date:</strong> {order.orderDate}</p>
                    <p><strong>📦 Status:</strong> <span className="text-success">{order.orderStatus}</span></p>
                    <p><strong>📅 Delivered day:</strong> {order.deliveredDay}</p>

                    <p><strong>💰 Total Amount:</strong> <span className="text-danger">${order.totalAmount.toFixed(2)}</span></p>
                </Card.Body>
            </Card>

            <h4 className="mb-3">🛍 Ordered Items</h4>
            {order.items.map((item) => (
                <Card key={item.productId} className="mb-4 p-4 shadow-sm border-light">
                    <Card.Body>
                        <div className="d-flex align-items-center">
                            {/* Hiển thị ảnh sản phẩm */}
                            <div className="me-4" style={{ width: "200px" }}>
                                <Carousel indicators={false} interval={3000}>
                                    {item.images.map((img) => (
                                        <Carousel.Item key={img.id}>
                                            <div className="d-flex justify-content-center">
                                                <ImageZoomify productId={img.id} />
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>

                            {/* Thông tin sản phẩm */}
                            <div>
                                <Card.Title className="fw-bold">{item.productName}</Card.Title>
                                <p><strong>🏷 Brand:</strong> {item.productBrand}</p>
                                <p><strong>🔢 Quantity:</strong> {item.quantity}</p>

                                <p><strong>💲 Price:</strong> <span className="text-danger">${item.price.toFixed(2)}</span></p>
                                <WriteReviewButton orderId={order.id} productId={item.productId} />
                                </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default OrderDetail;
