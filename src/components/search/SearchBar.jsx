import React, {  useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategories } from '../../store/features/categorySlice';
import { setSelectedCategory, setSearchQuery, clearFilters } from '../../store/features/searchSlice';
import { useNavigate, useParams } from 'react-router-dom';
export const SearchBar = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.category)
  const {searchQuery, selectedCategory} = useSelector((state) => state.search)
  const {categoryId} = useParams();
  const navigate = useNavigate()


  const path  = window.location.pathname;
  const lastSegment = path.split("/").pop().trim();


  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(e.target.value))
  }

  const handleClearFilter = () => {
    dispatch(clearFilters())
    if(!lastSegment ||lastSegment === ""){
      navigate("/")
    }else{
    navigate("/products")
    }
  }

  const handleSearchQueryChange = (e) => {
    dispatch(setSearchQuery(e.target.value))
  }
  useEffect(() => {
    dispatch(getAllCategories())
    
  },[dispatch])


  useEffect(() => { 
    if(categoryId && categories.length > 0){
      const selectedCategory = categories.find((category) => category.id === parseInt(categoryId, 10))
      if(selectedCategory){
        dispatch(setSelectedCategory(selectedCategory.name))
      }else{
        dispatch(setSelectedCategory("all"))
      }
    }
  },[categoryId, categories, dispatch])

  return (
    
    <div className='search-bar input-group input-group-sm'>
      {/* {console.log("category"+categories)}  */}
        <select 
        value={selectedCategory}
        onChange={handleCategoryChange} className='form-control-sm'>
            <option value="all">All Category</option>
            
            {categories.map((category) =>(
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}

        </select>
        <input 
        type='text' 
        className='form-control' 
        placeholder='search for product(e.g. watch..)'
        value={searchQuery}
        onChange={handleSearchQueryChange}
        />
        <button onClick={handleClearFilter} className='search-button'>Clear Filter</button>

    </div>
  )
}
