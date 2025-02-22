import {configureStore} from "@reduxjs/toolkit"
import searchReducer from "./features/searchSlice"
import categoryReducer from "./features/categorySlice"
import productReducer from "./features/productSlice"
import paginationReducer from "./features/paginationSlice"
import cartReducer from "./features/cartSlice"
import orderReducer from "./features/orderSlice"
import imageReducer from "./features/imageSlice"
export const store= configureStore({
    reducer: {
        search: searchReducer,
        category: categoryReducer,
        product: productReducer,
        pagination: paginationReducer,
        cart: cartReducer,
        order: orderReducer,
        image: imageReducer,
    }
})