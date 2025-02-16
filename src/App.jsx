
import {createBrowserRouter, Route, RouterProvider, createRoutesFromElements} from "react-router-dom"
import RootLayout from './components/layout/RootLayout'
import { Home } from './components/home/Home'

function App() {
  const router= createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>}> 
        <Route index element={<Home/>}/>

      </Route>
      
    )
  )
  return (
    <RouterProvider router={router}/>
  )
}

export default App
