import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  addCategory,
} from "../../store/features/categorySlice";

const CategorySelector = ({
  selectedCategory,
  onCategoryChange,
  newCategory,
  showNewCategoryInput,
  setNewCategory,
  setShowNewCategoryInput,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.category);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleAddNewCategory = () => {
    if (newCategory !== "") {
      dispatch(addCategory({name : newCategory}));
      onCategoryChange(newCategory);
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === "New") {
      setShowNewCategoryInput(true);
    } else {
      onCategoryChange(e.target.value);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  return (
    <div className='mb-3'>
      <label className='form-label'> Categories :</label>
      <select
        className='form-select'
        required
        value={selectedCategory}
        onChange={handleCategoryChange}>
        <option value=''>All Categories</option>
        <option value='New'>Add New Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {showNewCategoryInput && (
        <div className='input-group'>
          <input
            type='text'
            className='form-control'
            value={newCategory}
            placeholder='Enter new category'
            onChange={handleNewCategoryChange}
          />
          <button
            className='btn btn-secondary btn-sm'
            type='button'
            onClick={handleAddNewCategory}>
            Add Category
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;

