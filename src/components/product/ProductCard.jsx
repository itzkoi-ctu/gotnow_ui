import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductImage from "../utils/ProductImage";
import { FaShoppingCart } from "react-icons/fa";
import StockStatus from "../utils/StockStatus";
import { deleteProduct } from "../../store/features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ProductCard = ({ products }) => {
  const navigate= useNavigate()
  const dispatch= useDispatch()
  const userRoles= useSelector((state) => state.auth.roles)
  const isAdmin= userRoles.includes("ROLE_ADMIN")
  const handleDeleteProduct = async (productId) => {
      try{
          const result= await dispatch(deleteProduct(productId)).unwrap()
          console.log("message: "+ result.message)
          toast.success(result.message)
      }catch(error){
          toast.error(error.message)
      }
  }
  
  const handleAddToCart = (productId) => {
      navigate(`/product/${productId}/details`)
  }
  return (
    <main className='row m-2 m-2'>
      {products.map((product) => (
        <div className='col-12 col-sm-6 col-md-4 col-lg-2' key={product.id}>
          <Card className="product-card-in-all">
  <Link to={`/product/${product.id}/details`} className="product-link">
    <div className="image-container">
      {product.images.length > 0 && (
        <ProductImage productId={product.images[0].id} />
      )}
    </div>
  </Link>
  <Card.Body className="product-body-in-all">
    <p className="product-description-in-all">{product.name} - {product.brand}</p>
    <h4 className="price-in-all">${product.price}</h4>
    <p>
      <StockStatus inventory={product.inventory}/>
    </p>
    <div className="product-actions-in-all">
      {isAdmin && (
        <>
          <Link to={`/update-product/${product.id}/update`} className="edit-btn">Edit</Link>
          <Link onClick={() => handleDeleteProduct(product.id)} className="delete-btn">Delete</Link>
        </>
      )}
      <button className="shop-now-button" onClick={() => handleAddToCart(product.id)}>
        <FaShoppingCart/> Add to cart
      </button>
    </div>
  </Card.Body>
</Card>
        </div>
      ))}
    </main>
  );
};

export default ProductCard;
