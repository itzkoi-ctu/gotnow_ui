import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../../components/services/api"



export const createPaymentIntent = createAsyncThunk(
  "payments/createPaymentIntent",
  async ({ amount, currency }) => {
    // console.log("createPaymentIntent from the slice :", {amount, currency})
    const response = await api.post("/orders/create-payment-intent", {
      amount,
      currency,
    });
    return response.data;
  }
);

export const placeOrder = createAsyncThunk(
    "order/placeOrder", async({userId}) => {
        
            const response = await api.post(`/orders/user/${userId}/place-order`)
            // console.dir("The response from order slice: "+JSON.stringify(response.data))
            // console.dir("The response from order slice:2 "+ response.data.data)

            return response.data
        
    }
)

export const getOrderByUserId = createAsyncThunk(
    "order/getOrderByUserId", async(userId) => {
        
            const response = await api.get(`/orders/user/${userId}/order`)
            // console.dir("The response from order slice: "+JSON.stringify(response.data))
            // console.dir("The response from order slice:2 "+ response.data.data)

            return response.data.data
        
    }
)
export const updateOrderStatus = createAsyncThunk(
  "order/confirmReceived", async({orderId,status}) => {
    console.log("orderId: "+orderId)
          const response = await api.put(`/orders/update/${orderId}/order?orderStatus=${status}`)
          // console.log("The response from order slice: "+ response.data)
          // console.log("The response from order slice:2 "+ response.data.data)

          return response.data.data
      
  }
)

export const getAllOrders = createAsyncThunk(
  "order/getAllOrders", async() => {
    
          const response = await api.get("/orders/all/order")
          console.log("The response from order slice: "+ JSON.stringify(response.data))
          console.log("The response from order slice:2 "+ response.data.data)

          return response.data.data
      
  }
)



const initialState= {
    orders: [],
    ordersAdmin: [],
    loading: false,
    errorMessage: null,
    successMessage: null
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
        
    }
})


export default orderSlice.reducer;