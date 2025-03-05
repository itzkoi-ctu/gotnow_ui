import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus } from "../../store/features/orderSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderAdminDetail from "./OrderAdminDetail";

const statusColors = {
  PENDING: "badge bg-warning",
  PROCESSING: "badge bg-primary",
  SHIPPED: "badge bg-info",
  DELIVERED: "badge bg-success",
};

const nextStatus = {
  PENDING: "PROCESSING",
  PROCESSING: "SHIPPED",
};

const ManageOrder = () => {
  const dispatch = useDispatch();
  const reduxOrders = useSelector((state) => state.order.ordersAdmin || []);
  const [localOrders, setLocalOrders] = useState([]);
  const [loadingOrderIds, setLoadingOrderIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // Mặc định sắp xếp mới nhất

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    setLocalOrders(reduxOrders);
  }, [reduxOrders]);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const newStatus = nextStatus[currentStatus];
    if (newStatus) {
      try {
        setLoadingOrderIds((prev) => [...prev, orderId]);

        setLocalOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );

        await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();

        toast.success(`Order #${orderId} status updated to ${newStatus}`);
      } catch (error) {
        toast.error(`Failed to update order status: ${error.message || "Unknown error"}`);
        setLocalOrders(reduxOrders);
      } finally {
        setLoadingOrderIds((prev) => prev.filter((id) => id !== orderId));
      }
    }
  };

  const filteredOrders = (selectedStatus === "ALL"
    ? [...localOrders]  // Tạo bản sao của mảng
    : localOrders.filter(order => order.orderStatus === selectedStatus)
  ).slice().sort((a, b) => {
    const dateA = new Date(a.orderDate);
    const dateB = new Date(b.orderDate);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
  

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleOpenDetail = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseDetail = () => {
    setSelectedOrderId(null);
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" />
      <h2 className="text-center mb-4 fw-bold">📦 Manage Orders</h2>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-outline-primary" onClick={() => dispatch(getAllOrders())}>
          <i className="bi bi-arrow-repeat me-1"></i> Refresh Orders
        </button>

        {/* Nút sắp xếp */}
        <div>
          <button
            className={`btn btn-outline-secondary me-2 ${sortOrder === "newest" ? "active" : ""}`}
            onClick={() => handleSort("newest")}
          >
            Mới nhất
          </button>
          <button
            className={`btn btn-outline-secondary ${sortOrder === "oldest" ? "active" : ""}`}
            onClick={() => handleSort("oldest")}
          >
            Cũ nhất
          </button>
        </div>
      </div>

      {/* Bộ lọc trạng thái đơn hàng */}
      <div className="mb-3">
        {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "ALL"].map((status) => (
          <button
            key={status}
            className={`btn btn-outline${selectedStatus === status ? " active" : ""} me-2`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="card shadow">
        <div className="card-body">
          {filteredOrders.length > 0 ? (
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
                  {filteredOrders.map((order) => (
                    <tr key={order.id} onClick={() => handleOpenDetail(order.id)} style={{ cursor: "pointer" }}>
                      <td>{order.id}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="fw-bold text-primary">${order.totalAmount}</td>
                      <td>
                        {loadingOrderIds.includes(order.id) ? (
                          <span className="badge bg-info">
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            ></span>
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
                            {loadingOrderIds.includes(order.id) ? <>Processing...</> : <>Update: {nextStatus[order.orderStatus]}</>}
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

      {selectedOrderId && (
        <OrderAdminDetail orderId={selectedOrderId} show={Boolean(selectedOrderId)} onHide={handleCloseDetail} />
      )}
    </div>
  );
};

export default ManageOrder;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllOrders, updateOrderStatus } from "../../store/features/orderSlice";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import OrderAdminDetail from "./OrderAdminDetail";

// const statusColors = {
//   PENDING: "badge bg-warning",
//   PROCESSING: "badge bg-primary",
//   SHIPPED: "badge bg-info",
//   DELIVERED: "badge bg-success",
// };

// const nextStatus = {
//   PENDING: "PROCESSING",
//   PROCESSING: "SHIPPED",
// };

// const ManageOrder = () => {
//   const dispatch = useDispatch();
//   const reduxOrders = useSelector((state) => state.order.ordersAdmin || []);
//   const [localOrders, setLocalOrders] = useState([]);
//   const [loadingOrderIds, setLoadingOrderIds] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("ALL"); // Trạng thái đã chọn (ALL mặc định)
//       const [selectedOrderId, setSelectedOrderId] = useState(null);
  
//   useEffect(() => {
//     dispatch(getAllOrders());
//   }, [dispatch]);

//   useEffect(() => {
//     setLocalOrders(reduxOrders);
//   }, [reduxOrders]);

//   const handleUpdateStatus = async (orderId, currentStatus) => {
//     const newStatus = nextStatus[currentStatus];
//     if (newStatus) {
//       try {
//         setLoadingOrderIds((prev) => [...prev, orderId]);

//         setLocalOrders((prev) =>
//           prev.map((order) =>
//             order.id === orderId ? { ...order, orderStatus: newStatus } : order
//           )
//         );

//         await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();

//         toast.success(`Order #${orderId} status updated to ${newStatus}`);
//       } catch (error) {
//         toast.error(`Failed to update order status: ${error.message || "Unknown error"}`);
//         setLocalOrders(reduxOrders);
//       } finally {
//         setLoadingOrderIds((prev) => prev.filter((id) => id !== orderId));
//       }
//     }
//   };

//   const filteredOrders = selectedStatus === "ALL"
//     ? localOrders
//     : localOrders.filter(order => order.orderStatus === selectedStatus);



//     const handleOpenDetail = (orderId) => {
//       setSelectedOrderId(orderId);
//     };



//     const handleCloseDetail = () => {
//       setSelectedOrderId(null);
//     };
//   return (
//     <div className="container mt-4">
//       <ToastContainer position="top-right" />
//       <h2 className="text-center mb-4 fw-bold">📦 Manage Orders</h2>

//       <div className="d-flex justify-content-end mb-3">
//         <button className="btn btn-outline-primary" onClick={() => dispatch(getAllOrders())}>
//           <i className="bi bi-arrow-repeat me-1"></i> Refresh Orders
//         </button>
//       </div>

//       <div className="mb-3">
//         <button
//           className={`btn btn-outline${selectedStatus === "PENDING" ? " active" : ""}`}
//           onClick={() => setSelectedStatus("PENDING")}
//         >
//           Pending
//         </button>
//         <button
//           className={`btn btn-outline${selectedStatus === "PROCESSING" ? " active" : ""}`}
//           onClick={() => setSelectedStatus("PROCESSING")}
//         >
//           Processing
//         </button>
//         <button
//           className={`btn btn-outline${selectedStatus === "SHIPPED" ? " active" : ""}`}
//           onClick={() => setSelectedStatus("SHIPPED")}
//         >
//           Shipped
//         </button>
//         <button
//           className={`btn btn-outline${selectedStatus === "DELIVERED" ? " active" : ""}`}
//           onClick={() => setSelectedStatus("DELIVERED")}
//         >
//           Delivered
//         </button>
//         <button
//           className={`btn btn-outline${selectedStatus === "ALL" ? " active" : ""}`}
//           onClick={() => setSelectedStatus("ALL")}
//         >
//           All
//         </button>
//       </div>

//       <div className="card shadow">
//         <div className="card-body">
//           {filteredOrders.length > 0 ? (
//             <div className="table-responsive">
//               <table className="table table-hover">
//                 <thead className="table-dark">
//                   <tr>
//                     <th>#ID</th>
//                     <th>Order Date</th>
//                     <th>Total Amount</th>
//                     <th>Status</th>
//                     <th>Items</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map((order) => (
//                     <tr key={order.id} onClick={() => handleOpenDetail(order.id)} style={{ cursor: "pointer" }}>
//                       <td>{order.id}</td>
//                       <td>{order.orderDate}</td>
//                       <td className="fw-bold text-primary">${order.totalAmount}</td>
//                       <td>
//                         {loadingOrderIds.includes(order.id) ? (
//                           <span className="badge2 bg-info">
//                             <span
//                               className="spinner-border spinner-border-sm me-1"
//                               role="status"
//                               aria-hidden="true"
//                             ></span>
//                             Updating...
//                           </span>
//                         ) : (
//                           <span className={statusColors[order.orderStatus] || "badge2 bg-secondary"}>
//                             {order.orderStatus}
//                           </span>
//                         )}
//                       </td>
//                       <td>
//                         <ul className="list-unstyled">
//                           {order.items.map((item) => (
//                             <li key={item.productId} className="d-flex align-items-center">
//                               <span className="fw-semibold">{item.productName}</span>
//                               <span className="text-muted ms-2">({item.quantity}x - ${item.price})</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                       <td>
//                         {nextStatus[order.orderStatus] && (
//                           <button
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() => handleUpdateStatus(order.id, order.orderStatus)}
//                             disabled={loadingOrderIds.includes(order.id)}
//                           >
//                             {loadingOrderIds.includes(order.id) ? <>Processing...</> : <>Update: {nextStatus[order.orderStatus]}</>}
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-center text-muted">No orders found.</p>
//           )}
//         </div>
//       </div>
//       {selectedOrderId && (
//         <OrderAdminDetail orderId={selectedOrderId} 
//         show={Boolean(selectedOrderId)} 
//         onHide={handleCloseDetail}  />
//       )}
//     </div>
//   );
// };

// export default ManageOrder;
