import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../../components/services/api"


// Thunk để gửi review lên server
export const postReview = createAsyncThunk(
    "rating/postReview",
    async ({ orderId, userId, productId, rating, comment }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/rating/${orderId}/add/${userId}/rating/${productId}`,
                { rating, comment }
            );
            return response.data; // Server trả về dữ liệu đánh giá
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const fetchReviews = createAsyncThunk(
    "rating/fetchReviews",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/rating/all/${productId}/rating`);
            console.log("response from the slice:", response.data);
            
            if (!response.data || !response.data.data) {
                return rejectWithValue("Invalid response structure");
            }
            
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);



const ratingSlice = createSlice({
    name: "rating",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.push(action.payload);
            })
            .addCase(postReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReviews.fulfilled,(state, action) => {
                state.reviews= action.payload
                state.loading= false
            })
    },
});

export default ratingSlice.reducer;
