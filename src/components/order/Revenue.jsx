
// import React, { useEffect, useState } from 'react';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useDispatch, useSelector } from 'react-redux';
// import {getAllOrders} from "../../store/features/orderSlice"
// const Revenue = () => {
//   const sampleData = useSelector((state) => state.order.ordersAdmin || []);
//   console.log("Redux state:", sampleData);
// const dispatch= useDispatch()
//   const [viewMode, setViewMode] = useState('chart');
//   const [chartType, setChartType] = useState('bar');
//   const [timeFilter, setTimeFilter] = useState('day');
  
//   // Lọc chỉ lấy các đơn hàng có trạng thái DELIVERED
//   const deliveredOrders = sampleData.filter(order => order.orderStatus === "DELIVERED");

//   // Hàm nhóm doanh thu theo ngày, tháng, năm
//   const groupRevenueByTime = (orders, type) => {
//     return orders.reduce((acc, order) => {
//       let key;
//       const date = new Date(order.orderDate);
//       if (type === 'day') key = date.toISOString().split('T')[0];
//       else if (type === 'month') key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
//       else if (type === 'year') key = `${date.getFullYear()}`;
      
//       if (!acc[key]) acc[key] = 0;
//       acc[key] += order.totalAmount;
//       return acc;
//     }, {});
//   };

//   useEffect(() =>{
//     dispatch(getAllOrders())
//   },[dispatch])
//   const revenueData = groupRevenueByTime(deliveredOrders, timeFilter);

//   const chartData = Object.keys(revenueData).map(date => ({
//     name: date,
//     revenue: revenueData[date]
//   }));

//   return (
//     <div className="container">
//       <div className="card shadow my-4">
//         <div className="card-body">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 className="card-title">Shop Revenue Dashboard</h2>
//             <div className="btn-group">
//               <button onClick={() => setViewMode('chart')} className={`btn ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline-primary'}`}>Charts</button>
//               <button onClick={() => setViewMode('stats')} className={`btn ${viewMode === 'stats' ? 'btn-primary' : 'btn-outline-primary'}`}>Statistics</button>
//             </div>
//           </div>

//           {viewMode === 'stats' ? (
//             <div className="row">
//               <div className="col-md-4 mb-3">
//                 <div className="card bg-primary bg-opacity-10">
//                   <div className="card-body">
//                     <h5 className="card-title text-primary">Total Revenue</h5>
//                     <p className="display-5 fw-bold text-primary">${deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}</p>
//                   </div>
//                 </div>
//               </div>




              
//               <div className="col-md-4 mb-3">
//                 <div className="card bg-success bg-opacity-10">
//                   <div className="card-body">
//                     <h5 className="card-title text-success">Total Orders</h5>
//                     <p className="display-5 fw-bold text-success">{deliveredOrders.length}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div>
//               <div className="d-flex justify-content-between mb-3">
//                 <div className="btn-group">
//                   <button onClick={() => setChartType('bar')} className={`btn ${chartType === 'bar' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Bar Chart</button>
//                   <button onClick={() => setChartType('line')} className={`btn ${chartType === 'line' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Line Chart</button>
//                 </div>
//                 <div className="btn-group">
//                   <button onClick={() => setTimeFilter('day')} className={`btn ${timeFilter === 'day' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Day</button>
//                   <button onClick={() => setTimeFilter('month')} className={`btn ${timeFilter === 'month' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Month</button>
//                   <button onClick={() => setTimeFilter('year')} className={`btn ${timeFilter === 'year' ? 'btn-secondary' : 'btn-outline-secondary'}`}>Year</button>
//                 </div>
//               </div>

//               <div style={{ height: '300px' }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   {chartType === 'bar' ? (
//                     <BarChart data={chartData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
//                       <Legend />
//                       <Bar dataKey="revenue" fill="#0d6efd" name="Revenue" />
//                     </BarChart>
//                   ) : (
//                     <LineChart data={chartData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
//                       <Legend />
//                       <Line type="monotone" dataKey="revenue" stroke="#0d6efd" name="Revenue" activeDot={{ r: 8 }} />
//                     </LineChart>
//                   )}
//                 </ResponsiveContainer>
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
import { getAllOrders } from "../../store/features/orderSlice";

const Revenue = () => {
  const sampleData = useSelector((state) => state.order.ordersAdmin || []);
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState('chart');
  const [chartType, setChartType] = useState('bar');
  const [timeFilter, setTimeFilter] = useState('day');
  // New state for date range filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Filter only DELIVERED orders and apply date range filter
  const deliveredOrders = sampleData
    .filter(order => order.orderStatus === "DELIVERED")
    .filter(order => {
      const orderDate = new Date(order.orderDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (
        (!start || orderDate >= start) &&
        (!end || orderDate <= end)
      );
    });

  // Group revenue by day, month, or year
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

          {/* Date Range Filter */}
          <div className="mb-3 d-flex gap-3">
            <div>
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
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