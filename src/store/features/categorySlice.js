import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../components/services/api"
export const getAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async () => {
        const response = await api.get("/categories/all");
        console.log(response.data.data)
        return response.data.data;
    }
)

const initialState = {
    category: [],
    errorMessage: null,
}   
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
        extraReducers: (buider) => {
            buider
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.category = action.payload;
                state.errorMessage = null;
                state.isLoading = false;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.category = [];
                state.errorMessage = action.error.message;
                state.isLoading = false;
            })
            .addCase(getAllCategories.pending, (state, action) => {
                state.errorMessage = null;
                state.isLoading = true;
            })

        }
    
    
    
});
export default categorySlice.reducer