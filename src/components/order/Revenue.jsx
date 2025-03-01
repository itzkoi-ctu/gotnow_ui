// import React, { useState } from 'react';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useSelector } from 'react-redux';

// const Revenue = () => {
//   // Sample data from the API response
//   const sampleData = useSelector((state) => state.order.ordersAdmin || []);
//   console.log("Redux state:", sampleData);

//   const [viewMode, setViewMode] = useState('chart');
//   const [chartType, setChartType] = useState('bar');
  
//   // Calculate metrics from order data
//   const orders = sampleData;
//   const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
//   const averageOrderValue = totalRevenue / orders.length;
  
//   // Group data by user for visualization
//   const userRevenue = orders.reduce((acc, order) => {
//     const userId = `User ${order.userId}`;
//     if (!acc[userId]) {
//       acc[userId] = 0;
//     }
//     acc[userId] += order.totalAmount;
//     return acc;
//   }, {});
  
//   // Prepare data for charts
//   const chartData = Object.keys(userRevenue).map(user => ({
//     name: user,
//     revenue: userRevenue[user]
//   }));
  
//   // Order-based chart data
//   const orderChartData = orders.map(order => ({
//     name: `Order #${order.id}`,
//     amount: order.totalAmount
//   }));
  

  
//   return (
//     <div className="container">
//       <div className="card shadow my-4">
//         <div className="card-body">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 className="card-title">Shop Revenue Dashboard</h2>
//             <div className="btn-group">
//               <button 
//                 onClick={() => setViewMode('chart')}
//                 className={`btn ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline-primary'}`}
//               >
//                 Charts
//               </button>
//               <button 
//                 onClick={() => setViewMode('stats')}
//                 className={`btn ${viewMode === 'stats' ? 'btn-primary' : 'btn-outline-primary'}`}
//               >
//                 Statistics
//               </button>
//             </div>
//           </div>
          
//           {viewMode === 'stats' ? (
//             <div className="row">
//               <div className="col-md-4 mb-3">
//                 <div className="card bg-primary bg-opacity-10">
//                   <div className="card-body">
//                     <h5 className="card-title text-primary">Total Revenue</h5>
//                     <p className="display-5 fw-bold text-primary">${totalRevenue.toLocaleString()}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-4 mb-3">
//                 <div className="card bg-success bg-opacity-10">
//                   <div className="card-body">
//                     <h5 className="card-title text-success">Total Orders</h5>
//                     <p className="display-5 fw-bold text-success">{orders.length}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-4 mb-3">
//                 <div className="card bg-purple bg-opacity-10">
//                   <div className="card-body">
//                     <h5 className="card-title text-purple">Average Order Value</h5>
//                     <p className="display-5 fw-bold text-primary">${averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div>
//               <div className="d-flex justify-content-end mb-3">
//                 <div className="btn-group">
//                   <button 
//                     onClick={() => setChartType('bar')}
//                     className={`btn ${chartType === 'bar' ? 'btn-secondary' : 'btn-outline-secondary'}`}
//                   >
//                     Bar Chart
//                   </button>
//                   <button 
//                     onClick={() => setChartType('line')}
//                     className={`btn ${chartType === 'line' ? 'btn-secondary' : 'btn-outline-secondary'}`}
//                   >
//                     Line Chart
//                   </button>
//                 </div>
//               </div>
              
//               <div className="mb-4">
//                 <h4>Revenue by User</h4>
//                 <div style={{ height: '300px' }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     {chartType === 'bar' ? (
//                       <BarChart data={chartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
//                         <Legend />
//                         <Bar dataKey="revenue" fill="#0d6efd" name="Revenue" />
//                       </BarChart>
//                     ) : (
//                       <LineChart data={chartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
//                         <Legend />
//                         <Line type="monotone" dataKey="revenue" stroke="#0d6efd" name="Revenue" activeDot={{ r: 8 }} />
//                       </LineChart>
//                     )}
//                   </ResponsiveContainer>
//                 </div>
//               </div>
              
//               <div>
//                 <h4>Revenue by Order</h4>
//                 <div style={{ height: '300px' }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     {chartType === 'bar' ? (
//                       <BarChart data={orderChartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
//                         <Legend />
//                         <Bar dataKey="amount" fill="#198754" name="Order Amount" />
//                       </BarChart>
//                     ) : (
//                       <LineChart data={orderChartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
//                         <Legend />
//                         <Line type="monotone" dataKey="amount" stroke="#198754" name="Order Amount" activeDot={{ r: 8 }} />
//                       </LineChart>
//                     )}
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Revenue;
import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import {getAllOrders} from "../../store/features/orderSlice"
const Revenue = () => {
  const sampleData = useSelector((state) => state.order.ordersAdmin || []);
  console.log("Redux state:", sampleData);
const dispatch= useDispatch()
  const [viewMode, setViewMode] = useState('chart');
  const [chartType, setChartType] = useState('bar');
  const [timeFilter, setTimeFilter] = useState('day');
  
  // Lọc chỉ lấy các đơn hàng có trạng thái DELIVERED
  const deliveredOrders = sampleData.filter(order => order.orderStatus === "DELIVERED");

  // Hàm nhóm doanh thu theo ngày, tháng, năm
  const groupRevenueByTime = (orders, type) => {
    return orders.reduce((acc, order) => {
      let key;
      const date = new Date(order.orderDate);
      if (type === 'day') key = date.toISOString().split('T')[0];
      else if (type === 'month') key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      else if (type === 'year') key = `${date.getFullYear()}`;
      
      if (!acc[key]) acc[key] = 0;
      acc[key] += order.totalAmount;
      return acc;
    }, {});
  };

  useEffect(() =>{
    dispatch(getAllOrders())
  },[dispatch])
  const revenueData = groupRevenueByTime(deliveredOrders, timeFilter);

  const chartData = Object.keys(revenueData).map(date => ({
    name: date,
    revenue: revenueData[date]
  }));

  return (
    <div className="container">
      <div className="card shadow my-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title">Shop Revenue Dashboard</h2>
            <div className="btn-group">
              <button onClick={() => setViewMode('chart')} className={`btn ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline-primary'}`}>Charts</button>
              <button onClick={() => setViewMode('stats')} className={`btn ${viewMode === 'stats' ? 'btn-primary' : 'btn-outline-primary'}`}>Statistics</button>
            </div>
          </div>

          {viewMode === 'stats' ? (
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card bg-primary bg-opacity-10">
                  <div className="card-body">
                    <h5 className="card-title text-primary">Total Revenue</h5>
                    <p className="display-5 fw-bold text-primary">${deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>




              
              <div className="col-md-4 mb-3">
                <div className="card bg-success bg-opacity-10">
                  <div className="card-body">
                    <h5 className="card-title text-success">Total Orders</h5>
                    <p className="display-5 fw-bold text-success">{deliveredOrders.length}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-between mb-3">
                <div className="btn-group">
                  <button onClick={() => setChartType('bar')} className={`btn ${chartType === 'bar' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Bar Chart</button>
                  <button onClick={() => setChartType('line')} className={`btn ${chartType === 'line' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Line Chart</button>
                </div>
                <div className="btn-group">
                  <button onClick={() => setTimeFilter('day')} className={`btn ${timeFilter === 'day' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Day</button>
                  <button onClick={() => setTimeFilter('month')} className={`btn ${timeFilter === 'month' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Month</button>
                  <button onClick={() => setTimeFilter('year')} className={`btn ${timeFilter === 'year' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Year</button>
                </div>
              </div>

              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0d6efd" name="Revenue" />
                    </BarChart>
                  ) : (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#0d6efd" name="Revenue" activeDot={{ r: 8 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Revenue;
