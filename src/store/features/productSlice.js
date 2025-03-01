import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {api, privateApi} from "../../components/services/api"


    
export const getAllProducts = createAsyncThunk(
    "product/getAllProducts",
    async () => {
        const response = await api.get("/products/all");
        return response.data.data;
    }
)


export const addNewProduct = createAsyncThunk(
    "product/addNewProduct",
    async (product, {rejectWithValue}) => {
        try{
            const response = await privateApi.post("/products/add", product);
        return response.data.data;
        }catch(error){
            console.log("error from add product: "+ error.response?.data)
            return rejectWithValue(error.response?.data)
        }
    }
)
export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (productId) => {
        const response = await privateApi.delete(`/products/product/${productId}/delete`);
        console.log("response delete: "+response.data)

        return response.data;
    }
)
export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ productId, updatedProduct }) => {
      const response = await privateApi.put(
        `/products/product/${productId}/update`,
        updatedProduct
      );
      console.log("updatedProduct: "+updateProduct)
      console.log("response: "+response.data)

      return response.data;
    }
  );
  
export const getAllBrands = createAsyncThunk(
    "product/getAllBrands",
    async () => {
        const response = await api.get("/products/distinct/brands");
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
        // console.log("response from slice:",response.data.data)
        return response.data.data;
    }
)

export const getProductsByCategoryId= createAsyncThunk(
    "product/getProductsByCategoryId",
    async (categoryId) => {
        const response = await api.get(`products/category/${categoryId}/products`);
        // console.log("response from slice (getProductsByCategory):",response.data.data)
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
    isLoading: true
}   
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        filterByBrands: (state, action) => {
            const {brand, isChecked} = action.payload;
            if(isChecked){
                state.selectedBrands.push(brand)
        }else{
            state.selectedBrands= state.selectedBrands.filter((item) => item !== brand)
        }

        },  
        setQuantity: (state,action) => {
            state.quantity= action.payload
        },
        addBrand: (state, action) => {
            state.brands.push(action.payload)
        },
        clearError: (state) => {
            state.errorMessage= null
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
            .addCase(addNewProduct.fulfilled, (state, action)=> {
                state.products.push(action.payload);
                state.errorMessage= null;
                state.isLoading= false;
            })
            .addCase(addNewProduct.rejected,(state, action) => {
                state.errorMessage=action.payload
                state.isLoading=false
            })
            .addCase(addNewProduct.pending, (state, action) =>{
                state.isLoading= true
                state.errorMessage= null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.product= action.payload.data;
                state.errorMessage = null;
                state.isLoading = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                  (product) => product.id !== action.payload.data
                );
              });


        }
    
    
    
});
export const {filterByBrands, setQuantity, addBrand, clearError}= productSlice.actions
export default productSlice.reducer;