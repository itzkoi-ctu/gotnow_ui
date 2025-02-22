// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Link, useParams } from 'react-router-dom';
// import { getOrderByUserId } from '../../store/features/orderSlice';
// import { ToastContainer } from 'react-toastify';



// const Order = () => {
//     const {userId} = useParams()
// const dispatch= useDispatch();
// const orders = useSelector((state) => state.order.orders)
// const loading= useSelector((state) => state.cart.loading)

// useEffect(() => {
//     dispatch(getOrderByUserId(userId))
// },[dispatch, userId])


// if(loading){
// return <div>Loading...</div>
// }

//   return (
//     <div className='container mt-5'>
//       <ToastContainer />
//       <div className='row'>
//         <div className='col-4'>
//           <h3 className='mb-4 cart-title'>My Order History</h3>
//         </div>
//       </div>
//       {orders.length === 0 ? (
//         <p>No orders found at the moment.</p>
//       ) : (
//         <table className='table'>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Date</th>
//               <th>Total Amount</th>
//               <th>Status</th>
//               <th>Items</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order, index) => (
//               <tr key={index}>
//                 <td>{order.id}</td>
//                 <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                 <td>${order.totalAmount.toFixed(2)}</td>
//                 <td>{order.orderStatus}</td>
//                 <td>
//                   <table className='table table-sm table-bordered table-striped table-hover'>
//                     <thead>
//                       <tr>
//                         <th>Item ID</th>
//                         <th>Name</th>
//                         <th>Brand</th>
//                         <th>Quantity</th>
//                         <th>Unit Price</th>
//                         <th>Total Price</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {order.items.map((item, index) => (
//                         <tr key={index}>
//                           <td>{item.productId}</td>
//                           <td>{item.productName}</td>
//                           <td>{item.productBrand}</td>
//                           <td>{item.quantity}</td>
//                           <td>${item.price.toFixed(2)}</td>
//                           <td>${item.quantity * item.price}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//       <div className='mb-2'>
//         <Link to={"/products"}>Start Shopping</Link>
//       </div>
//     </div>
//   )
// }

// export default Order
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { getOrderByUserId } from '../../store/features/orderSlice';
import { ToastContainer } from 'react-toastify';
import LoadSpinner from '../common/LoadSpinner'; // Assuming you have this component

const Order = () => {
    const { userId } = useParams()
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.order.orders) || [];
    const isLoading = useSelector((state) => state.order.isLoading)
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await dispatch(getOrderByUserId(userId)).unwrap();
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setIsInitialLoad(false);
            }
        };

        fetchOrders();
    }, [dispatch, userId]);

    if (isLoading || isInitialLoad) {
        return <LoadSpinner />;
    }

    return (
        <div className='container mt-5'>
            <ToastContainer />
            <div className='row'>
                <div className='col-4'>
                    <h3 className='mb-4 cart-title'>My Order History</h3>
                </div>
            </div>
            {!orders || orders.length === 0 ? (
                <div className="text-center my-5">
                    <p className="mb-4">No orders found at the moment.</p>
                    <Link to="/products" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id || index}>
                                    <td>{order.id}</td>
                                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>${(order.totalAmount || 0).toFixed(2)}</td>
                                    <td>{order.orderStatus || 'Processing'}</td>
                                    <td>
                                        {order.items && order.items.length > 0 ? (
                                            <table className='table table-sm table-bordered table-striped table-hover'>
                                                <thead>
                                                    <tr>
                                                        <th>Item ID</th>
                                                        <th>Name</th>
                                                        <th>Brand</th>
                                                        <th>Quantity</th>
                                                        <th>Unit Price</th>
                                                        <th>Total Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items.map((item, itemIndex) => (
                                                        <tr key={item.productId || itemIndex}>
                                                            <td>{item.productId}</td>
                                                            <td>{item.productName}</td>
                                                            <td>{item.productBrand}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>${(item.price || 0).toFixed(2)}</td>
                                                            <td>${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>No items found</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='mb-2'>
                        <Link to="/products" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Order;