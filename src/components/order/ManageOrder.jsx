import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus } from "../../store/features/orderSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColors = {
  PENDING: "badge bg-warning",
  PROCESSING: "badge bg-primary",
  SHIPPED: "badge bg-success",
  DELIVERED: "badge bg-secondary",
  CANCELED: "badge bg-danger",
};

const nextStatus = {
  PENDING: "PROCESSING",
  PROCESSING: "SHIPPED",
};

const ManageOrder = () => {
  const dispatch = useDispatch();
  const reduxOrders = useSelector((state) => state.order.ordersAdmin || []);
  console.log(reduxOrders)
  // Local state to manage orders and provide immediate UI updates
  const [localOrders, setLocalOrders] = useState([]);
  const [loadingOrderIds, setLoadingOrderIds] = useState([]);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Update local orders whenever Redux orders change
  useEffect(() => {
    setLocalOrders(reduxOrders);
  }, [reduxOrders]);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const newStatus = nextStatus[currentStatus];
    if (newStatus) {
      try {
        // Start loading state
        setLoadingOrderIds(prev => [...prev, orderId]);
        
        // Optimistically update the UI
        setLocalOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, orderStatus: newStatus } 
              : order
          )
        );
        
        // Make the API call
        await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
        
        // Show success message
        toast.success(`Order #${orderId} status updated to ${newStatus}`);
      } catch (error) {
        // Show error message
        toast.error(`Failed to update order status: ${error.message || 'Unknown error'}`);
        
        // Revert the optimistic update
        setLocalOrders(reduxOrders);
      } finally {
        // End loading state
        setLoadingOrderIds(prev => prev.filter(id => id !== orderId));
      }
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" />
      <h2 className="text-center mb-4 fw-bold">📦 Manage Orders</h2>
      
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-outline-primary" 
          onClick={() => dispatch(getAllOrders())}
        >
          <i className="bi bi-arrow-repeat me-1"></i> Refresh Orders
        </button>
      </div>
      
      <div className="card shadow">
        <div className="card-body">
          {localOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#ID</th>
                    <th>Order Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {localOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.orderDate}</td>
                      <td className="fw-bold text-primary">${order.totalAmount}</td>
                      <td>
                        {loadingOrderIds.includes(order.id) ? (
                          <span className="badge bg-info">
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Updating...
                          </span>
                        ) : (
                          <span className={statusColors[order.orderStatus] || "badge bg-secondary"}>
                            {order.orderStatus}
                          </span>
                        )}
                      </td>
                      <td>
                        <ul className="list-unstyled">
                          {order.items.map((item) => (
                            <li key={item.productId} className="d-flex align-items-center">
                              <span className="fw-semibold">{item.productName}</span>
                              <span className="text-muted ms-2">({item.quantity}x - ${item.price})</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        {nextStatus[order.orderStatus] && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleUpdateStatus(order.id, order.orderStatus)}
                            disabled={loadingOrderIds.includes(order.id)}
                          >
                            {loadingOrderIds.includes(order.id) ? (
                              <>Processing...</>
                            ) : (
                              <>Cập nhật: {nextStatus[order.orderStatus]}</>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;