import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../store/features/orderSlice";
import ImageZoomify from "../common/ImageZoomify";
import ProductImage from "../utils/ProductImage";

const OrderAdminDetail = ({ orderId, show, onHide }) => {
    const dispatch= useDispatch()
    const orderDetails= useSelector((state) => state.order.orderDetail)
    console.log("from OrderDetail Admin: "+ JSON.stringify(orderDetails))
    useEffect(() => {
        dispatch(getOrderById(orderId))
        setLoading(false)
    },[dispatch,orderId])

  const [loading, setLoading] = useState(true);


   

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details #{orderId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p>Loading...</p>
          </div>
        ) : orderDetails ? (
          <>
            <p><strong>Order Date:</strong> {orderDetails.orderDate}</p>
            <p><strong>Customer:</strong> {orderDetails.username}</p>

            <p><strong>Total Amount:</strong> ${orderDetails.totalAmount}</p>
            <p><strong>Status:</strong> {orderDetails.orderStatus}</p>
            <h5>Items:</h5>
            <ul className="list-unstyled">
              {orderDetails.items.map((item) => (
                <li key={item.productId} className="mb-2">
                  <strong>{item.productName}</strong> ({item.productBrand}) -
                  {item.quantity} x ${item.price}
                  <div className="d-flex mt-2">
                    {item.images.map((img) => (
                      <ProductImage productId={img.id}/>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-danger">No order details found.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderAdminDetail;
