import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {api} from "../../components/services/api";
import axios from "axios";

export const getUserById = createAsyncThunk(
    "user/getUserById",
    async(userId) => {
        const response = api.get(`/users/user/${userId}/user`)
        console.log("response date from user slice: "+ response.data.data)
        return response.data
    }
);


export const registerUser = createAsyncThunk(
    "user/registerUser",
    async ({ user, addresses }) => {
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        addressList: addresses,
      };
      const response = await api.post("/users/add", payload);
      return response.data;
    }
  );
  

export const getCountryNames = createAsyncThunk(
    "user/getCountryNames",
    async () => {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const countryNames = response.data.map((country) => country.name.common);
      countryNames.sort((a, b) => a.localeCompare(b));
      console.log("The country names from the slice", response.data);
      return countryNames;
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
            
    },

    extraReducers: (builder) => {
        builder
        .addCase(getUserById.fulfilled,(state, action) => {
            state.user= action.payload
            state.loading= false
        })
        .addCase(getUserById.rejected,(state, action)=> {
            state.errorMessage= action.error.message
            state.loading= false

        })
        .addCase(registerUser.fulfilled,(state, action) => {
            state.user= action.payload
            state.loading= false
        })
        .addCase(registerUser.rejected,(state, action)=> {
            state.errorMessage= action.error.message
            state.loading= false

        })

    }
})

export default userSlice.reducer;