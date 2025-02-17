import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../components/services/api"
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
const initialState = {
    
    products: [],
    brands:  [],
    distinctProducts: [],
    selectedBrands: [],
    errorMessage: null,
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


        }
    
    
    
});
export const {filterByBrands}= productSlice.actions
export default productSlice.reducer;