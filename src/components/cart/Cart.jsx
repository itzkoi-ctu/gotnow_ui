
import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  clearCartApi,
  getUserCart,
  updateQuantity,
  removeItemFromCart,
} from "../../store/features/cartSlice";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import ProductImage from "../utils/ProductImage";
import QuantityUpdater from "../utils/QuantityUpdater";
import LoadSpinner from "../common/LoadSpinner";
import { toast, ToastContainer } from "react-toastify";
import { FaTrash } from "react-icons/fa"; // Icon delete

const Cart = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartId = useSelector((state) => state.cart.cartId);
  const isLoading = useSelector((state) => state.cart.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserCart(userId));
  }, [dispatch, userId]);

  const handleIncreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && cartId) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity + 1,
        })
      );
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && item.quantity > 1) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    try {
      dispatch(removeItemFromCart({ cartId, itemId }));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePlaceOrder = async () => {
    await dispatch(getUserCart(userId));
    navigate(`/checkout/${userId}/checkout`);
  };

  const handleClearCart = async () => {
    dispatch(clearCart());
    await dispatch(clearCartApi(cartId));
  };

  if (isLoading) {
    return <LoadSpinner />;
  }

  return (
    <Container className="mt-5 mb-5 p-4">
      <ToastContainer />
      <h2 className="mb-4 text-center text-uppercase">Shopping Cart</h2>

      {cart.items.length === 0 ? (
        <div className="text-center mt-4">
          <h4 className="text-muted">Your cart is empty</h4>
          <Link to="/products" className="btn btn-outline-primary mt-3">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <Card className="shadow-lg p-4">
            <Table responsive striped hover className="mb-4">
              <thead className="bg-light">
                <tr className="text-center">
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item, index) => (
                  <tr key={index} className="text-center align-middle">
                    <td>
                      <Link to={`/product/${item.product.id}/details`}>
                        {item.product.images.length > 0 && (
                          <ProductImage productId={item.product.images[0].id} />
                        )}
                      </Link>
                    </td>
                    <td>{item.product.name}</td>
                    <td>{item.product.brand}</td>
                    <td>${item.product.price.toFixed(2)}</td>
                    <td>
                      <QuantityUpdater
                        quantity={item.quantity}
                        onDecrease={() =>
                          handleDecreaseQuantity(item.product.id)
                        }
                        onIncrease={() =>
                          handleIncreaseQuantity(item.product.id)
                        }
                      />
                    </td>
                    <td>${item.totalPrice.toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Row className="mt-4">
              <Col md={6}>
                <h4 className="text-muted">Total: ${cart.totalAmount.toFixed(2)}</h4>
              </Col>
              <Col md={6} className="text-end">
                <Button variant="outline-danger" className="me-2" onClick={handleClearCart}>
                  Clear Cart
                </Button>
                <Button variant="success" onClick={handlePlaceOrder}>
                  Proceed to Checkout
                </Button>
              </Col>
            </Row>
          </Card>

          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-outline-primary">
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
