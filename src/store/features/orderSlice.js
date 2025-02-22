import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../../components/services/api"
import axios from "axios";


export const placeOrder = createAsyncThunk(
    "order/placeOrder", async(userId) => {
        
            const response = await api.post(`/orders/user/${userId}/place-order`)
            console.dir("The response from order slice: "+JSON.stringify(response.data))
            console.dir("The response from order slice:2 "+ response.data.data)

            return response.data
        
    }
)

export const getOrderByUserId = createAsyncThunk(
    "order/getOrderByUserId", async(userId) => {
        
            const response = await api.get(`/orders/user/${userId}/order`)
            console.dir("The response from order slice: "+JSON.stringify(response.data))
            console.dir("The response from order slice:2 "+ response.data.data)

            return response.data.data
        
    }
)

const initialState= {
    orders: [],
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
          });
    }
})


export default orderSlice.reducer;