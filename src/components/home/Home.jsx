import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Hero  from '../hero/Hero'
import Paginator from "../common/Paginator"
import { Card } from 'react-bootstrap'
import ProductImage from '../utils/ProductImage'
import {toast, ToastContainer} from 'react-toastify'
import {getProductsDistinct} from '../../store/features/productSlice'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setTotalItems } from '../../store/features/paginationSlice'
import StockStatus from '../utils/StockStatus'
export const Home = () => {
    const dispatch = useDispatch();


  const [filteredProducts, setFilteredProducts] = useState([])  

  const {searchQuery, selectedCategory} = useSelector((state)=> state.search)
  const{itemsPerPage, currentPage}= useSelector((state) => state.pagination)
  const productsDistinct = useSelector((state) => state.product.distinctProducts)

  const [error, setError] = useState(null)
 
  useEffect(() => { 
    dispatch(getProductsDistinct())
  }, [dispatch]);// Only fetch date when product state change

 


  useEffect(() => {
    const results = productsDistinct.filter((product) =>{
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
    product.category.name.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesQuery && matchesCategory;
    })
    setFilteredProducts(results)
  },[searchQuery,selectedCategory, productsDistinct])

  useEffect(()=>{
      dispatch(setTotalItems(filteredProducts.length))
    },[filteredProducts, dispatch])

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );


  
  return (

    <>
      <Hero/>
    <div className='d-flex flex-wrap justify-content-center p-5'>
   
      <ToastContainer/>
      {currentProducts
      &&currentProducts.map((product, index)=>{
        return(
        <Card key={product.id} className='home-product-card'>
        <Link to={`products/${product.name}`} className= 'link'>
            <div className='image-container'>
              {product.images.length > 0 && (
                <ProductImage productId={product.images[0].id} />
              )}
            </div>
         </Link>
        <Card.Body className='product-description'>
          {/* <p>{product.name} - {product.description}</p> */}
          <h4 className='price'>${product.price}</h4>
          <p>
              <StockStatus inventory={product.inventory}/>
            </p>
          <Link 
          to={`products/${product.name}`} 
          className='shop-now-button'
          >
          {" "}
          Shop now 
          </Link>
        </Card.Body>
      </Card>)
      
      })}
      
    
    
    </div>
    <Paginator/>
    </>
  )
}
