
import {createBrowserRouter, Route, RouterProvider, createRoutesFromElements} from "react-router-dom"
import RootLayout from './components/layout/RootLayout'
import { Home } from './components/home/Home'
import  Product  from './components/product/Products'
import ProductDetails from "./components/product/ProductDetails"
import Cart from "./components/cart/Cart"
import Order from "./components/order/Order"
import AddProduct from "./components/product/AddProduct"
import ProductUpdate from "./components/product/ProductUpdate"
import UserRegistration from "./components/user/UserRegistration"
import Login from "./components/auth/Login"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Unauthorized from "./components/Unauthorized"
import UserProfile from "./components/user/UserProfile"
import Checkout from "./components/checkout/Checkout"
import ManageOrder from "./components/order/ManageOrder"
import Revenue from "./components/order/Revenue"
import OrderDetail from "./components/order/OrderDetail"
function App() {
  const router= createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>}> 
        <Route index element={<Home/>}/>
        <Route path="/products" element={<Product/>}/>
        <Route path="/products/:name" element={<Product/>}/>
        <Route path="/product/:productId/details" element={<ProductDetails/>}/>
        <Route path="/products/category/:categoryId/products" element={<Product/>}/>
        <Route path="/register" element={<UserRegistration/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/checkout/:userId/checkout" element={<Checkout/>}/>
        <Route path="/unauthorized" element={<Unauthorized/>}/>
        <Route path="/order-detail/:orderId/order" element={<OrderDetail/>}/>


        
        <Route element={<ProtectedRoute  useOutlet={true} allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />   }>
        <Route path="user/:userId/my-cart" element={<Cart/>}/>
        <Route path="order/:userId/my-order" element={<Order/>}/>
        <Route path='/user-profile/:userId/profile' element={<UserProfile/>} />


        </Route>

        <Route element={<ProtectedRoute useOutlet={true} allowedRoles={["ROLE_ADMIN"]}/>}>
       
        <Route path="/manage-orders" element={<ManageOrder/>}/>
        <Route path="/revenue" element={<Revenue/>}/>

        <Route path="/add-product" element={<AddProduct/>}/>
        <Route path="/update-product/:productId/update" element={<ProductUpdate/>}/>
        </Route>

        


        
      </Route>
      
    )
  )
  return (
    <RouterProvider router={router}/>
  )
}

export default App
