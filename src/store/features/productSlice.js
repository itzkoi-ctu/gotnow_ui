import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../../components/services/api"
export const getAllProducts = createAsyncThunk(
    "product/getAllProducts",
    async () => {
        const response = await api.get("/products/all");
        console.log(response.data.data)
        return response.data.data;
    }
)

export const getAllBrands = createAsyncThunk(
    "product/getAllBrands",
    async () => {
        const response = await api.get("/products/distinct/brands");
        console.log(response.data.data)
        return response.data.data;
    }
)
export const getProductsDistinct= createAsyncThunk(
    "product/getProductDistinct",
    async () => {
        const response = await api.get("products/distinct/products");
        return response.data.data;
    }
)

export const getProductById= createAsyncThunk(
    "product/getProductById",
    async (productId) => {
        const response = await api.get(`products/product/${productId}/product`);
        console.log("response from slice:",response.data.data)
        return response.data.data;
    }
)

export const getProductsByCategoryId= createAsyncThunk(
    "product/getProductsByCategoryId",
    async (categoryId) => {
        const response = await api.get(`products/category/${categoryId}/products`);
        console.log("response from slice (getProductsByCategory):",response.data.data)
        return response.data.data;
    }
)

const initialState = {
    
    products: [],
    product: null,
    brands:  [],
    distinctProducts: [],
    selectedBrands: [],
    quantity: 1,
    errorMessage: null,
    isLoading: false
}   
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        filterByBrands(state, action) {
            const {brand, isChecked} = action.payload;
            if(isChecked){
                state.selectedBrands.push(brand)
        }else{
            state.selectedBrands= state.selectedBrands.filter((item) => item !== brand)
        }

        } ,  
        decreaseQuantity(state) {
            if(state.quantity > 1){
                state.quantity -= 1;
            }
        },
        increaseQuantity(state) {
            state.quantity += 1;
        }


    },
        extraReducers: (buider) => {
            buider
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.errorMessage = null;
                state.isLoading = false;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.products = [];
                state.errorMessage = action.error.message;
                state.isLoading = false;
            })
            .addCase(getAllProducts.pending, (state, action) => {
                state.errorMessage = null;
                state.isLoading = true;
            })
            .addCase(getAllBrands.fulfilled, (state, action) => {
                state.brands = action.payload;
                state.errorMessage = null;
                state.isLoading = false;
            })
            .addCase(getProductsDistinct.fulfilled, (state, action) => {
                state.distinctProducts = action.payload;
                state.errorMessage = null;
                state.isLoading = false;
            })
            .addCase(getProductsDistinct.rejected, (state, action) => {
                state.distinctProducts = [];
                state.errorMessage = action.error.message;
                state.isLoading = false;
            })
            .addCase(getProductsDistinct.pending, (state, action) => {
                state.errorMessage = null;
                state.isLoading = true;
            })

            .addCase(getProductById.fulfilled,(state, action) => {
                state.product= action.payload;
                state.isLoading=false;       
            })
            .addCase(getProductsByCategoryId.fulfilled,(state, action) => {
                state.products= action.payload;
                state.isLoading=false;
            })


        }
    
    
    
});
export const {filterByBrands, decreaseQuantity, increaseQuantity}= productSlice.actions
export default productSlice.reducer;