
import {createBrowserRouter, Route, RouterProvider, createRoutesFromElements} from "react-router-dom"
import RootLayout from './components/layout/RootLayout'
import { Home } from './components/home/Home'
import  Product  from './components/product/Products'
import ProductDetails from "./components/product/ProductDetails"
import Cart from "./components/cart/Cart"
import Order from "./components/order/Order"
import AddProduct from "./components/product/AddProduct"
import ProductUpdate from "./components/product/ProductUpdate"

function App() {
  const router= createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>}> 
        <Route index element={<Home/>}/>
        <Route path="/products" element={<Product/>}/>
        <Route path="/products/:name" element={<Product/>}/>
        <Route path="/product/:productId/details" element={<ProductDetails/>}/>
        <Route path="/products/category/:categoryId/products" element={<Product/>}/>
        <Route path="user/:userId/my-cart" element={<Cart/>}/>
        <Route path="order/:userId/my-order" element={<Order/>}/>
        <Route path="/add-product" element={<AddProduct/>}/>
        <Route path="/update-product/:productId/update" element={<ProductUpdate/>}/>

        
      </Route>
      
    )
  )
  return (
    <RouterProvider router={router}/>
  )
}

export default App
