import React from 'react'
import { BsDash, BsPlus } from 'react-icons/bs'
import { decreaseQuantity, increaseQuantity } from '../../store/features/productSlice'
import { useDispatch, useSelector } from 'react-redux'
export const QuantityUpdater = () => {
    const quantity = useSelector((state) => state.product.quantity)
    const dispatch = useDispatch()


  return (
    <section style={{width: '150px'}}>
        <div className='input-group'>
            <button 
            onClick={() => dispatch(decreaseQuantity())} 
            className='btn -btn-outline-secondary' value={quantity}  > 
            {" "}
            <BsDash/>
            </button>
            <input name='quantity' type='number' value={quantity} readOnly className='form-control text-center'>
            
            
            </input>
            <button 
            onClick={() => dispatch(increaseQuantity())} 
            className='btn -btn-outline-secondary'> 
            {" "}
            <BsPlus/>
            </button>

        </div>
    </section>
  )
}
