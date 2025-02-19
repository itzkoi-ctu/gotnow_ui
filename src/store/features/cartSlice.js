import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {api} from "../../components/services/api";


export const addToCart = createAsyncThunk(
    "cart,addToCart", async ({productId, quantity})=> {
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("quantity", quantity);

        const response = await api.post("/cartItems/item/add", formData);
        return response.data;
    }
)


export const getUserCart = createAsyncThunk(
    "cart/getUserCart", async (userId) => {
        console.log("getUserCart"+userId)
         const response = await api.get(`/carts/user/${userId}/cart`);
        // const response = await api.get(`/carts/user/1/cart`);
        // console.log("Response from cart slice: "+ response.data)
        // console.log("Response from cart slice2: "+ response.data.data)

        return response.data.data;
    }
)

export const removeItemFromCart = createAsyncThunk(
    "cart/removeItemFromCart", async ({cartId, itemId}) => {
         const response = await api.delete(`/cartItems/cart/${cartId}/item/${itemId}/remove`);
        // const response = await api.get(`/carts/user/1/cart`);
        console.log("Response from cart slice: "+ response.data)
        console.log("Response from cart slice2: "+ response.data.data)

        return response.data.data;
    }
)

const initialState= {
    items:  [],
    cartId: null,
    totalAmount: 0,
    errorMessage:  null,
    successMessage: null,
    isLoading: false,
}


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.successMessage = action.payload.message;            
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.errorMessage = action.error.message;
        })
        .addCase(getUserCart.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.cartId= action.payload.cartId
            state.totalAmount = action.payload.totalAmount;
            state.isLoading= false;
            state.errorMessage = null;
        })
        .addCase(getUserCart.pending,(state,action)=> {
            state.isLoading= true
        })
        .addCase(getUserCart.rejected, (state, action) => {
            state.errorMessage = action.error.message;
        })
        .addCase(removeItemFromCart.fulfilled,(state, action)=> {
            const itemId = action.payload;
            state.items = state.items.filter((item) => item.product.id !== itemId);
            state.totalAmount = state.items.reduce(
              (total, item) => total + item.totalPrice,
              0
            );
        })
    }
})
export default cartSlice.reducer;