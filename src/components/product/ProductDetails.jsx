import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getProductById, setQuantity } from '../../store/features/productSlice'
import { FaShoppingCart } from 'react-icons/fa';
import ImageZoomify from '../common/ImageZoomify';
import QuantityUpdater from '../utils/QuantityUpdater';
import { addToCart } from '../../store/features/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import StockStatus from '../utils/StockStatus';
const ProductDetails = () => {
    const {productId} = useParams();
    const {product, quantity}= useSelector((state) => state.product)
    const isAuthenticated= useSelector((state) => state.auth.isAuthenticated)
    const {errorMessage, successMessage}= useSelector((state) => state.cart)
    const productOutOfStock = product?.inventory <= 0;
    const dispatch= useDispatch();

    useEffect(()=> {
        dispatch(getProductById(productId))
    }, [dispatch, productId])



    const handleAddToCart = async () => {
      if(!isAuthenticated){
        toast.error("You need to be login to add items to cart")
        return
      }

      try {
          const result = await dispatch(addToCart({productId, quantity})).unwrap();
          toast.success("Product added to cart successfully");
      } catch (error) {
          toast.error(error.message);
      }
  }

  const handleIncreaseQuantity = () => {
      dispatch(setQuantity(quantity + 1))
  }

  const handleDecreaseQuantity = () => {
      if(quantity > 1) {
          dispatch(setQuantity(quantity - 1))
      }
  }

  return (
    <div className='container mt-4 mb-4'>
      {product ? (
        <div className='row product-details'>
          <ToastContainer />
          <div className='col-md-2'>
            {product.images.map((img) => (
              <div key={img.id} className='image-container'>
                <ImageZoomify productId={img.id} />
              </div>
            ))}
          </div>
          <div className='col-md-8 details-container'>
            <h1 className='product-name'>{product.name}</h1>
            <h4 className='price'>${product.price}</h4>
            <p className='product-description'>{product.description}</p>
            <p className='product-name'>Brand: {product.brand}</p>
            <p className='product-name'>
              Rating: <span className='rating'>some stars</span>
            </p>
            <p>
              <StockStatus inventory={product.inventory}/>
            </p>
            <p>Quantity:</p>
            <QuantityUpdater
              quantity={quantity}
              onDecrease={handleDecreaseQuantity}
              onIncrease={handleIncreaseQuantity}
              disabled={productOutOfStock}
            />

            <div className='d-flex gap-2 mt-3'>
              <button 
              onClick={handleAddToCart}
              className='add-to-cart-button'
              disabled={productOutOfStock}
              >
              
                {" "}
                <FaShoppingCart /> Add to cart
              </button>
              <button className='buy-now-button'
              disabled={productOutOfStock}
              >Buy now</button>
            </div>
          </div>
        </div>
      ) : (
        <p>No product</p>
      )}
    </div>
  )
}

export default ProductDetails