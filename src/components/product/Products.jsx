import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { SearchBar } from '../search/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../store/features/productSlice';
import Paginator from '../common/Paginator';
import { setTotalItems } from '../../store/features/paginationSlice';
import SideBar from '../common/SideBar';
import {setInitialSearchQuery} from "../../store/features/searchSlice";
import { useLocation, useParams } from 'react-router-dom';
import LoadSpinner from '../common/LoadSpinner';
const Product = () => {
    const dispatch = useDispatch();
    const {products, selectedBrands} = useSelector((state) => state.product)
      const [filteredProducts, setFilteredProducts] = useState([])  
      const {searchQuery, selectedCategory} = useSelector((state)=> state.search)
    
      const{itemsPerPage, currentPage}= useSelector((state) => state.pagination)


       const isLoading = useSelector((state) => state.product.isLoading)

      const {name} =useParams();
      const location= useLocation();
      const queryParams= new URLSearchParams(location.search)
      const initialSearchQuery = queryParams.get("search") || name || "";



    useEffect(() => {  
        dispatch(getAllProducts());
    }, [dispatch]);// Only fetch date when product state change

    useEffect(() => {
      dispatch(setInitialSearchQuery(initialSearchQuery))
    },[initialSearchQuery, dispatch])

useEffect(() => {
    const results = products.filter((product) =>{
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
    product.category.name.toLowerCase().includes(selectedCategory.toLowerCase())

    const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((selectedBrand) =>
          product.brand.toLowerCase().includes(selectedBrand.toLowerCase())
        );

    return matchesQuery && matchesCategory  &&matchesBrand })
    setFilteredProducts(results)
  },[searchQuery,selectedCategory,selectedBrands, products])


  useEffect(()=>{
    dispatch(setTotalItems(filteredProducts.length))
  },[filteredProducts, dispatch])


  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  if(isLoading){
    return(
    <div className="d-flex justify-content-center">
      <LoadSpinner/>
    </div>
    )
  }
  return (


    <>
    <div className='d-flex justify-content-center'>
        <div className='col-md-6 mt-2'>

            <div className='search-bar input-group'>
               <SearchBar/>
            </div>
        </div>
    </div>
    <div className='d-flex'>
        <aside className='sidebar' style={{width: "250px", padding: "1rem"}}>
          <SideBar/>
       </aside>
        <section style={{flex: "1"}}>
            <ProductCard products={currentProducts}/>
            
        </section>
        
       

    </div>
    <Paginator/>
    
    </>
  )
}
export default Product;