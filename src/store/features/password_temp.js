// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "../../components/services/api";
// import axios from "axios";

// // Gửi OTP đến email
// export const sendOTP = createAsyncThunk(
//     "password/sendOTP",
//     async (email, { rejectWithValue }) => {
//         try {
//             const response=await api.post(`/auth/forgot-password?email=${email}`);
//             console.log("response from send otp: "+ JSON.stringify(response.data))

//             return response.data; // Giả sử server trả về true nếu gửi thành công
//         } catch (error) {
//             return rejectWithValue(error.response?.data || "Lỗi khi gửi OTP!");
//         }
//     }
// );

// // Xác minh OTP
// export const verifyOTP = createAsyncThunk(
//     "password/verifyOTP",
//     async ({ email, otp }, { rejectWithValue }) => {
//         try {
//             console.log("email: " + email + " otp: " + otp)
//             const response = await api.post(`/auth/verify-otp?email=${email}&otp=${otp}`);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || "Lỗi khi xác minh OTP!");
//         }
//     }
// );

// // Đặt lại mật khẩu
// export const resetPassword = createAsyncThunk(
//     "password/resetPassword",
//     async ({ email, newPassword }, { rejectWithValue }) => {
//         try {
//             const response=await api.post(`/auth/reset-password?email=${email}&newPassword=${newPassword}`);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || "Lỗi khi đặt lại mật khẩu!");
//         }
//     }
// );

// const passwordSlice = createSlice({
//     name: "password",
//     initialState: {
//         message: null,
//         isVerified: false,
//         isLoading: false,
//         error: null,
//         isOtpSent: false,
//     },
//     reducers: {
//         resetState: (state) => {
//             state.message = null;
//             state.isVerified = false;
//             state.isLoading = false;
//             state.error = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(sendOTP.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(sendOTP.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isOtpSent = action.payload.data; // Đánh dấu rằng OTP đã được gửi
//                 state.error = null;

//                 state.message = action.payload.message;
//             })
//             .addCase(sendOTP.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isOtpSent = false; // Đánh dấu rằng OTP chưa được gửi
//                 state.error = action.payload;
//             })
//             .addCase(verifyOTP.pending, (state) => {
//                 state.message = null; 
//                 // Đặt lại thông báo khi bắt đầu xác minh OTP
//                 state.isLoading = true;
//             })
//             .addCase(verifyOTP.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isOtpSent = false; // Đặt lại trạng thái gửi OTP
//                 state.message = action.payload.message;
//                 state.isVerified = action.payload.data;
//             })
//             .addCase(verifyOTP.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload;
//             })
//             .addCase(resetPassword.pending, (state) => {
//                 state.message = null; // Đặt lại thông báo khi bắt đầu đặt lại mật khẩu
//                 state.isLoading = true;
//             })
//             .addCase(resetPassword.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isVerified = false; // Đặt lại trạng thái xác minh sau khi đặt lại mật khẩu
//                 state.isOtpSent = false; // Đặt lại trạng thái gửi OTP
//                 state.message = action.payload.message;
//             })
//             .addCase(resetPassword.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload;
//             });
//     },
// });

// export const { resetState } = passwordSlice.actions;
// export default passwordSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../components/services/api";

// Gửi OTP đến email
export const sendOTP = createAsyncThunk(
    "password/sendOTP",
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post(`/auth/forgot-password?email=${email}`);
            console.log("response from send otp: " + JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi khi gửi OTP!");
        }
    }
);

// Xác minh OTP
export const verifyOTP = createAsyncThunk(
    "password/verifyOTP",
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            console.log("email: " + email + " otp: " + otp);
            const response = await api.post(`/auth/verify-otp?email=${email}&otp=${otp}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi khi xác minh OTP!");
        }
    }
);

// Đặt lại mật khẩu
export const resetPassword = createAsyncThunk(
    "password/resetPassword",
    async ({ email, newPassword }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/auth/reset-password?email=${email}&newPassword=${newPassword}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi khi đặt lại mật khẩu!");
        }
    }
);

const passwordSlice = createSlice({
    name: "password",
    initialState: {
        message: null,
        isVerified: false,
        isLoading: false,
        error: null,
        isOtpSent: false,
        resetSuccess: false,
        
    },
    reducers: {
        resetState: (state) => {
            state.message = null;
            state.isVerified = false;
            state.isLoading = false;
            state.error = null;
            state.isOtpSent = false;
            state.resetSuccess = false;
        },
        clearMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOTP.pending, (state) => {
                state.isLoading = true;
                state.message = null; // Clear message
            })
            .addCase(sendOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isOtpSent = action.payload.data;
                state.error = null;
                state.message = action.payload.message;
            })
            .addCase(sendOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.isOtpSent = false;
                state.error = action.payload;
            })
            .addCase(verifyOTP.pending, (state) => {
                state.isLoading = true;
                state.message = null; // Clear message
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isOtpSent = false;
                state.message = action.payload.message;
                state.isVerified = action.payload.data;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.message = null; // Clear message
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isVerified = false;
                state.isOtpSent = false;
                state.message = action.payload.message;
                state.resetSuccess = true;

            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetState, clearMessage } = passwordSlice.actions;
export default passwordSlice.reducer;