import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {api} from "../../components/services/api";
import axios from "axios";

export const getUserById = createAsyncThunk(
    "user/getUserById",
    async(userId) => {
        const response = await api.get(`/users/user/${userId}/user`)
        console.log("response date from user slice: "+ response.data.data)
        return response.data.data
    }
);


export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ user, addresses }, { rejectWithValue }) => {
    try {
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        addressList: addresses,
      };
      const response = await api.post("/users/add", payload);
      return response.data;
    } catch (error) {
      // console.error("Register Error:", error.response?.data); 
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);


export const getCountryNames = createAsyncThunk(
    "user/getCountryNames",
    async () => {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const countryNames = response.data.map((country) => ({
        name: country.name.common,
        code: country.cca2
      }));
      countryNames.sort((a, b) => a.name.localeCompare(b.name));
      console.log("The country names from the slice", response.data);
      return countryNames;
    }
  );


// Add Address Thunk
export const addAddress = createAsyncThunk(
  "user/addAddress",
  async ({ address, userId }) => {
    const response = await api.post(`/addresses/${userId}/new`, [address]);
    return response.data;
  }
);

// Fetch User Addresses Thunk
export const fetchAddresses = createAsyncThunk(
  "user/fetchAddresses",
  async (userId) => {   
    const response = await api.get(`/addresses/${userId}/address`);
    return response.data;
  }
);

// Update Address Thunk
export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async ({ id, address }) => {
    const response = await api.put(`/addresses/${id}/update`, address);
    return response.data;
  }
);

// Delete Address Thunk
export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async ({id}) => {
    const response = await api.delete(`/addresses/${id}/delete`);
    return response.data;
  }
);


export const uploadAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(`/users/${userId}/upload-avatar`, formData);

      return response.data.avatarUrl; // Trả về avatarUrl mới từ backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  }
);
  
const initialState= {
    user: null,
    loading: false,
    errorMessage: null
    
}
const userSlice= createSlice({
    name: "user",
    initialState,
    reducers: {
      setUser(state, action) {
        state.user = action.payload;
      },
      setUserAddresses(state, action) {
        state.user.addressList = action.payload;
      }, 
    },

    extraReducers: (builder) => {
        builder
        .addCase(getUserById.fulfilled, (state, action) => {
          state.user = action.payload;
          state.loading = false;
        })
        .addCase(getUserById.rejected, (state, action) => {
          state.errorMessage = action.error.message;
          state.loading = false;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.user = action.payload;
          state.loading = false;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.errorMessage = action.error.message;
          state.loading = false;
        })
        .addCase(uploadAvatar.fulfilled, (state, action) => {
          if (state.userInfo) {
            state.userInfo.avatarUrl = action.payload;
          }
        })

    }
})
export const {setUser, setUserAddresses} = userSlice.actions

export default userSlice.reducer;