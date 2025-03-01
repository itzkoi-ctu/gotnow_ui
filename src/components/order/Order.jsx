
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Link, useParams } from 'react-router-dom';
// import { confirmReceived, getOrderByUserId } from '../../store/features/orderSlice';
// import { ToastContainer } from 'react-toastify';
// import LoadSpinner from '../common/LoadSpinner'; // Assuming you have this component

// const Order = () => {
    
//     const { userId } = useParams()
//     const dispatch = useDispatch();
//     const orders = useSelector((state) => state.order.orders) || [];
//     const isLoading = useSelector((state) => state.order.isLoading)
//     const [isInitialLoad, setIsInitialLoad] = useState(true);
//     const [disabled, setDisabled] = useState(true)
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 await dispatch(getOrderByUserId(userId)).unwrap();
//             } catch (error) {
//                 console.error('Failed to fetch orders:', error);
//             } finally {
//                 setIsInitialLoad(false);
//             }
//         };

//         fetchOrders();
//     }, [dispatch, userId]);

//     useEffect(() => {
//         if (orders.some(order => order.orderStatus === 'SHIPPED')) {
//             setDisabled(false);
//         }
//          else {
//             setDisabled(true);
//         }
//     }, [orders]);


//     const handleChangeOrderStatus= (orderId) =>{
//         console.log("orderId from Order: "+ orderId)
//         dispatch(confirmReceived(orderId))
        
//     } 


//     if (isLoading || isInitialLoad) {
//         return <LoadSpinner />;
//     }

//     return (
//         <div className='container mt-5'>
//             <ToastContainer />
//             <div className='row'>
//                 <div className='col-4'>
//                     <h3 className='mb-4 cart-title'>My Order History</h3>
//                 </div>
//             </div>
//             {!orders || orders.length === 0 ? (
//                 <div className="text-center my-5">
//                     <p className="mb-4">No orders found at the moment.</p>
//                     <Link to="/products" className="btn btn-primary">
//                         Start Shopping
//                     </Link>
//                 </div>
//             ) : (
//                 <>
//                     <table className='table'>
//                         <thead>
//                             <tr>
//                                 <th>Order ID</th>
//                                 <th>Date</th>
//                                 <th>Total Amount</th>
//                                 <th>Status</th>
//                                 <th>Items</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {orders.map((order, index) => (
//                                 <tr key={order.id || index}>
//                                     <td>{order.id}</td>
//                                     <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
//                                     <td>${(order.totalAmount || 0).toFixed(2)}</td>
//                                     <td>{order.orderStatus || 'Processing'}</td>
                                    
                                    
//                                     <td>
//                                         {order.items && order.items.length > 0 ? (
//                                             <table className='table table-sm table-bordered table-striped table-hover'>
//                                                 <thead>
//                                                     <tr>
//                                                         <th>Item ID</th>
//                                                         <th>Name</th>
//                                                         <th>Brand</th>
//                                                         <th>Quantity</th>
//                                                         <th>Unit Price</th>
//                                                         <th>Total Price</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {order.items.map((item, itemIndex) => (
//                                                         <tr key={item.productId || itemIndex}>
//                                                             <td>{item.productId}</td>
//                                                             <td>{item.productName}</td>
//                                                             <td>{item.productBrand}</td>
//                                                             <td>{item.quantity}</td>
//                                                             <td>${(item.price || 0).toFixed(2)}</td>
//                                                             <td>${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                                                           
                                                    
//                                                         </tr>
//                                                     ))}
                                                    
//                                                 </tbody>
//                                             </table>
                                            
//                                         ) : (
//                                             <p>No items found</p>
//                                         )}
//                                     </td>
                                    
//                                     <td> 
//                                     <button 
//                                     disabled={disabled}
//                                     className='btn btn-primary'
//                                     onClick={()=>handleChangeOrderStatus(order.id)}
//                                     >Confirm received</button>                                               
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <div className='mb-2'>
//                         <Link to="/products" className="btn btn-primary">
//                             Continue Shopping
//                         </Link>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Order;
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { getOrderByUserId, updateOrderStatus } from '../../store/features/orderSlice';
import { ToastContainer } from 'react-toastify';
import LoadSpinner from '../common/LoadSpinner';

const Order = () => {
    const { userId } = useParams()
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.order.orders) || [];
    const isLoading = useSelector((state) => state.order.isLoading)
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [processingOrderIds, setProcessingOrderIds] = useState([]);
    // Local state to manage orders while Redux updates
    const [localOrders, setLocalOrders] = useState([]);
    
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

    // Update local orders whenever Redux orders change
    useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);

    const handleChangeOrderStatus = async (orderId) => {
        try {
            setProcessingOrderIds(prev => [...prev, orderId]);
            
            // Optimistically update the UI
            setLocalOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId 
                        ? { ...order, orderStatus: 'DELIVERED' } 
                        : order
                )
            );
            
            // Perform the actual API request
            await dispatch(updateOrderStatus({ orderId: orderId, status: "DELIVERED" })).unwrap();
            
            // If you want to refresh all orders after confirmation
            // Uncomment this if your Redux action doesn't properly update the state
            // await dispatch(getOrderByUserId(userId)).unwrap();
        } catch (error) {
            console.error('Failed to confirm order:', error);
            
            // Revert optimistic update if there was an error
            setLocalOrders(orders);
        } finally {
            setProcessingOrderIds(prev => prev.filter(id => id !== orderId));
        }
    }

    const isButtonDisabled = (order) => {
        return order.orderStatus !== 'SHIPPED' || processingOrderIds.includes(order.id);
    }

    if (isLoading || isInitialLoad) {
        return <LoadSpinner />;
    }

    // Use localOrders for rendering instead of the Redux orders
    const displayOrders = localOrders.length > 0 ? localOrders : orders;

    return (
        <div className='container mt-5'>
            <ToastContainer />
            <div className='row'>
                <div className='col-4'>
                    <h3 className='mb-4 cart-title'>My Order History</h3>
                </div>
            </div>
            {!displayOrders || displayOrders.length === 0 ? (
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
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayOrders.map((order, index) => (
                                <tr key={order.id || index}>
                                    <td>{order.id}</td>
                                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>${(order.totalAmount || 0).toFixed(2)}</td>
                                    <td>
                                        {processingOrderIds.includes(order.id) ? (
                                            <span className="badge bg-warning text-dark">Updating...</span>
                                        ) : (
                                            order.orderStatus || 'Processing'
                                        )}
                                    </td>
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
                                    <td> 
                                        <button 
                                            disabled={isButtonDisabled(order)}
                                            className='btn btn-primary'
                                            onClick={() => handleChangeOrderStatus(order.id)}
                                        >
                                            {processingOrderIds.includes(order.id) ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                    Processing...
                                                </>
                                            ) : 'Confirm received'}
                                        </button>                                               
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