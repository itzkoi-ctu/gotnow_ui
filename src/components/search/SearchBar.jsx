import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategories } from '../../store/features/categorySlice';
export const SearchBar = ({onChange, onCategoryChange, onClear}) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.category)
  const {searchQuery, selectedCategory} = useSelector((state) => state.search)
  


  const handleCategoryChange = (e) => {
    onCategoryChange(e.target.value)
  }
  useEffect(() => {
    dispatch(getAllCategories())
    
  },[dispatch])

  return (
    
    <div className='search-bar input-group input-group-sm'>
      {console.log("category"+categories)} 
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
        onChange={onChange}
        />
        <button onClick={onClear} className='search-button'>Clear Filter</button>

    </div>
  )
}
