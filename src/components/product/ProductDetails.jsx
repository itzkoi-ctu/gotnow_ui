import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, setQuantity } from "../../store/features/productSlice";
import { FaShoppingCart } from "react-icons/fa";
import ImageZoomify from "../common/ImageZoomify";
import QuantityUpdater from "../utils/QuantityUpdater";
import { addToCart } from "../../store/features/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import StockStatus from "../utils/StockStatus";
import RatingOfProduct from "../rating/RatingOfProduct";
import { fetchReviews } from "../../store/features/ratingSlice";
import { Spinner } from "react-bootstrap";
import "./Product.css"; // Thêm CSS riêng để tùy chỉnh giao diện

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, quantity } = useSelector((state) => state.product);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const reviews = useSelector((state) => state.rating.reviews);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getProductById(productId));
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warning("🔒 Please log in to add items to your cart!");
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      toast.success("🛒 Product added to cart successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.warning("🔒 You need to log in to purchase this item!");
      return;
    }
    try {
      setIsLoading(true);
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      toast.success("🎉 Redirecting to cart...");
      setTimeout(() => {
        navigate(`/user/${userId}/my-cart`);
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncreaseQuantity = () => dispatch(setQuantity(quantity + 1));
  const handleDecreaseQuantity = () => {
    if (quantity > 1) dispatch(setQuantity(quantity - 1));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-4">
      <ToastContainer />
      {product ? (
        <div className="row product-details">
          {/* Hiển thị hình ảnh sản phẩm */}
          <div className="col-md-4 image-section">
            {product.images.map((img) => (
              <div key={img.id} className="image-container">
                <ImageZoomify productId={img.id} />
              </div>
            ))}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="col-md-8 details-container">
            <h1 className="product-name">{product.name}</h1>
            <h4 className="price">${product.price}</h4>
            <p className="product-description">{product.description}</p>
            <p className="brand">Brand: <strong>{product.brand}</strong></p>
            <StockStatus inventory={product.inventory} />

            <div className="quantity-section">
              <p>Quantity:</p>
              <QuantityUpdater
                quantity={quantity}
                onDecrease={handleDecreaseQuantity}
                onIncrease={handleIncreaseQuantity}
                disabled={product.inventory <= 0}
              />
            </div>

            {/* Nút thao tác */}
            <div className="button-group">
              <button 
                onClick={handleAddToCart} 
                className="btn btn-outline-primary" 
                disabled={product.inventory <= 0}
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button 
                className="btn btn-primary buy-now" 
                disabled={product.inventory <= 0} 
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Hiển thị đánh giá */}
          <div className="col-12 review-section">
            <RatingOfProduct ratings={reviews} />
          </div>
        </div>
      ) : (
        <p className="no-product-text">No product found</p>
      )}
    </div>
  );
};

export default ProductDetails;
