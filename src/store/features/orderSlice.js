import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {api, privateApi} from "../../components/services/api"
import { saveAs } from "file-saver";



export const createPaymentIntent = createAsyncThunk(
  "payments/createPaymentIntent",
  async ({ amount, currency }) => {
    // console.log("createPaymentIntent from the slice :", {amount, currency})
    const response = await privateApi.post("/orders/create-payment-intent", {
      amount,
      currency,
    });
    return response.data;
  }
);

export const placeOrder = createAsyncThunk(
    "order/placeOrder", async({userId, address}) => {
        
            const response = await privateApi.post(`/orders/user/${userId}/place-order`, address)
            

            return response.data
        
    }
)

export const getOrderByUserId = createAsyncThunk(
    "order/getOrderByUserId", async(userId) => {
        
            const response = await privateApi.get(`/orders/user/${userId}/order`)
            // console.dir("The response from order slice: "+JSON.stringify(response.data))
            // console.dir("The response from order slice:2 "+ response.data.data)

            return response.data.data
        
    }
)
export const updateOrderStatus = createAsyncThunk(
  "order/confirmReceived", async({orderId,status}) => {
    console.log("orderId: "+orderId)
          const response = await privateApi.put(`/orders/update/${orderId}/order?orderStatus=${status}`)
          // console.log("The response from order slice: "+ response.data)
          // console.log("The response from order slice:2 "+ response.data.data)

          return response.data.data
      
  }
)

export const getAllOrders = createAsyncThunk(
  "order/getAllOrders", async() => {
    
          const response = await privateApi.get("/orders/all/order")
          console.log("The response from order slice: "+ JSON.stringify(response.data))
          console.log("The response from order slice:2 "+ response.data.data)

          return response.data.data
      
  }
)
export const getOrderById = createAsyncThunk(
  "order/getOrderById", async(orderId) => {
    
          const response = await privateApi.get(`/orders/order/${orderId}/detail`)
          console.log("The response from order slice: "+ JSON.stringify(response.data))
          console.log("The response from order slice:2 "+ response.data.data)

          return response.data.data
      
  }
)



export const downloadOrders = createAsyncThunk(
  "order/downloadOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await privateApi.get("/orders/export", {
        responseType: "blob", // Để nhận về file dạng nhị phân
      });
      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      saveAs(blob, "orders.xlsx");
      return "success";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState= {
    orders: [],
    ordersAdmin: [],
    loading: false,
    errorMessage: null,
    successMessage: null,
    orderDetail: null,
    downloadStatus: "idle", // Trạng thái tải
    error: null,

}

const orderSlice = createSlice({
    name: "order",
    initialState,

    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(placeOrder.fulfilled, (state, action) => {
            state.orders.push(action.payload.order);
            state.loading = false;
            state.successMessage = action.payload.message;
          })
            .addCase(placeOrder.rejected, (state, action) => {
            state.errorMessage = action.error.message;
            state.loading = false;
          })        
          .addCase(getOrderByUserId.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.loading = false;
          })
          .addCase(getAllOrders.fulfilled, (state, action) => {
            state.ordersAdmin = action.payload;
            state.loading = false;
          })
          .addCase(getOrderById.fulfilled, (state,action)=> {
            state.orderDetail= action.payload
            state.loading = false;

          })
          .addCase(getOrderById.pending, (state,action)=> {
            state.loading = true;

          })
          .addCase(downloadOrders.pending, (state) => {
            state.downloadStatus = "loading";
          })
          .addCase(downloadOrders.fulfilled, (state) => {
            state.downloadStatus = "success";
          })
          .addCase(downloadOrders.rejected, (state, action) => {
            state.downloadStatus = "failed";
            state.error = action.payload;
          });
          
        
    }
})


export default orderSlice.reducer;