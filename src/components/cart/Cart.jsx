import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getUserCart, removeItemFromCart } from '../../store/features/cartSlice'
import { Card } from 'react-bootstrap'
import ProductImage from '../utils/ProductImage'
import ImageZoomify from '../common/ImageZoomify'
import { toast, ToastContainer } from 'react-toastify'
import LoadSpinner from '../common/LoadSpinner'


const Cart = () => {
    const {userId} = useParams()
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart)
    const cartId= useSelector((state) => state.cart.cartId)
    const isLoading= useSelector((state) => state.cart.isLoading)
    useEffect(() => {
        dispatch(getUserCart(userId))
    }
    , [dispatch, userId])

    const handleDecreaseQuantity = () =>{

    }


    const handleIncreaseQuantity = () =>{
        
    }

    const handleRemoveItem = (itemId) =>{
        try{
            dispatch(removeItemFromCart({cartId, itemId}))
            window.location.reload()
            toast.success("Item removed successfully!")
        }catch{console.error();
            toast.error(error.message)
        }
    }


        if(isLoading){
            return <LoadSpinner/>
        }
  
  return (
    <div className='container mt-5 mb-5 p-5'>
    <ToastContainer />
    <div className='d-flex flex-column'>
      <div className='d-flex justify-content-between mb-4 fw-bold'>
        <div className='text-center'>Image</div>
        <div className='text-center'>Name</div>
        <div className='text-center'>Brand</div>
        <div className='text-center'>Price</div>
        <div className='text-center'>Quantity</div>
        <div className='text-center'>Total Price</div>
        <div className='text-center'> Action</div>
      </div>
      <hr className="mb-2 mt-2"/>

      <h3 className='mb-4 cart-title'>My Shopping Cart</h3>

      {cart.items.map((item, index) => (
        <Card key={index} className='mb-4'>
          <Card.Body className='d-flex justify-content-between align-items-center shadow'>
            <div className='d-flex align-items-center'>
              <Link to={"#"}>
              
                <div className='cart-image-container'>
                    
                  {item.product.images.length > 0 && (
                    
                    <ImageZoomify productId={item.product.images[0].id} />
                    
                  )}
                </div>
              </Link>
            </div>
                  {console.log("productId from cart:"+item.product.images[0].id)}
            <div className='text-center'>{item.product.name}</div>
            <div className='text-center'>{item.product.brand}</div>
            <div className='text-center'>
              ${item.product.price.toFixed(2)}
            </div>
            <div className='text-center'>
              {/* <QuantityUpdater
                quantity={item.quantity}
                onDecrease={() => handleDecreaseQuantity(item.product.id)}
                onIncrease={() => handleIncreaseQuantity(item.product.id)}
              /> */}
            </div>
            <div className='text-center'>${item.totalPrice.toFixed(2)}</div>
            <div>
              <Link
                to={"#"}
                onClick={() => handleRemoveItem(item.product.id)}>
                <span className='remove-item'>Remove</span>
              </Link>
            </div>
          </Card.Body>
        </Card>
      ))}

      <hr />

      <div className='cart-footer d-flex align-items-center mt-4'>
        <h4 className='mb-0 cart-title'>
          Total Cart Amount: ${cart.totalAmount.toFixed(2)}
        </h4>
        <div className='ms-auto checkout-links'>
          <Link to={"/products"}>Continue Shopping</Link>
          <Link to={"#"}>Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Cart