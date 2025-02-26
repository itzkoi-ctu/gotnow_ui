import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {api} from "../../components/services/api";


const accessToken= localStorage.getItem("authToken")

export const addToCart = createAsyncThunk(
    "cart,addToCart", async ({productId, quantity})=> {
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("quantity", quantity);

        const response = await api.post("/cartItems/item/add", formData, {
            headers:{
               Authorization: `Bearer ${accessToken}`
            } 
        });
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

        return itemId;
    }
)   

export const updateQuantity = createAsyncThunk(
    "cart/updateQuantity", async ({cartId, itemId, newQuantity}) => {
         const response = await api.put(`/cartItems/cart/${cartId}/item/${itemId}/update?quantity=${newQuantity}`);
       
        return {itemId, newQuantity};
    }
)

const initialState= {
    items:  [],
    cartId: null,
    totalAmount: 0,
    errorMessage:  null,
    successMessage: null,
    isLoading: false,
    isInitialized: false,

}


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearSuccessMessage: (state) => {
            state.successMessage =null;
        },
        clearCart: (state) => {
            state.items = []
            state.totalAmount= 0;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.items.push(action.payload.data)
            state.successMessage = action.payload.message;            
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.errorMessage = action.error.message;
        })
        .addCase(addToCart.pending,(state) => {
            state.isLoading= true
        })
        .addCase(getUserCart.fulfilled, (state, action) => {
            state.items = action.payload.items || [];
            state.cartId= action.payload.cartId 
            state.totalAmount = action.payload.totalAmount || 0;
            state.isLoading= false;
            //state.isInitialized = true
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
        .addCase(updateQuantity.fulfilled,(state,action)=> {
            const {itemId, newQuantity}= action.payload
            const item = state.items.find((item) => item.product.id === itemId);
            if(item){
                item.quantity= newQuantity
                item.totalPrice= item.product.price * newQuantity
            }
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.totalPrice,
                0
              );
        })
    }
})

export const {clearSuccessMessage, clearCart} = cartSlice.actions;
export default cartSlice.reducer;
