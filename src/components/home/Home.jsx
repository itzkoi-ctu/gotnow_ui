import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Hero  from '../hero/Hero'
import Paginator from "../common/Paginator"
import { Card } from 'react-bootstrap'
import ProductImage from '../utils/ProductImage'
import {toast, ToastContainer} from 'react-toastify'
import { getDistinctProductByName } from '../services/ProductService'
import { Link } from 'react-router-dom'
export const Home = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])  

  const {searchQuery, selectedCategory} = useSelector((state)=> state.search)

  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage]= useState(1)
  const itemsPerPage= 5

  useEffect(() => {
    const getProducts = async () => {
      try{
        const response = await getDistinctProductByName()
        setProducts(response)
      }catch(error){
        setError(error.message)
        toast.error("Error fetching products: "+ error)

      }
    } 
    getProducts()
  },[])


  useEffect(() => {
    const results = products.filter((product) =>{
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
    product.category.name.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesQuery && matchesCategory;
    })
    setFilteredProducts(results)
  },[searchQuery,selectedCategory, products])

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
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
        console.log(`Rendering product #${index + 1}:`, product);
        return(
        <Card key={product.id} className='home-product-card'>
        <Link to={"#"} className= 'link'>
            <div className='image-container'>
              {product.images.length > 0 && (
                <ProductImage productId={product.images[0].id} />
              )}
            </div>
         </Link>
        <Card.Body className='product-description'>
          <p>{product.name} - {product.description}</p>
          <h4 className='price'>${product.price}</h4>
          <p className='text-success'>{product.inventory} in stock.</p>
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
    <Paginator
      itemsPerPage={itemsPerPage}
      totalItems={filteredProducts.length}
      currentPage={currentPage}
      paginate={paginate}
    />
    </>
  )
}
