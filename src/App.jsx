
import {createBrowserRouter, Route, RouterProvider, createRoutesFromElements} from "react-router-dom"
import RootLayout from './components/layout/RootLayout'
import { Home } from './components/home/Home'
import  Product  from './components/product/Products'
import ProductDetails from "./components/product/ProductDetails"

function App() {
  const router= createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>}> 
        <Route index element={<Home/>}/>
        <Route path="/products" element={<Product/>}/>
        <Route path="/products/:name" element={<Product/>}/>
        <Route 
          path="/product/:productId/details" 
          element={<ProductDetails/>}/>

      </Route>
      
    )
  )
  return (
    <RouterProvider router={router}/>
  )
}

export default App
