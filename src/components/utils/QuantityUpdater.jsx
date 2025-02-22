import React from 'react'
import { BsDash, BsPlus } from 'react-icons/bs'
export const QuantityUpdater = ({disabled,quantity, onIncrease, onDecrease}) => {
    


  return (
    <section style={{width: '150px'}}>
        <div className='input-group'>
            <button 
            onClick={onDecrease} 
            disabled={disabled}
            className='btn -btn-outline-secondary' value={quantity}  > 
            {" "}
            <BsDash/>
            </button>
            <input name='quantity' type='number' value={quantity} readOnly disabled={disabled} className='form-control text-center'>
            
            
            </input>
            <button 
            onClick={onIncrease} 
            disabled={disabled}
            className='btn -btn-outline-secondary'> 
            {" "}
            <BsPlus/>
            </button>

        </div>
    </section>
  )
}
