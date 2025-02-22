import React, { useRef, useState } from 'react'
import { nanoid } from 'nanoid';
import { uploadImages } from '../../store/features/imageSlice';
import { useDispatch } from 'react-redux';
import { toast , ToastContainer} from 'react-toastify';
import { Link } from 'react-router-dom';
import { BsDash, BsPlus } from 'react-icons/bs';
const ImageUploader = ({productId}) => {
  const [images, setImages] = useState([])
  const dispatch= useDispatch();
  const fileInputRefs = useRef([]);


  const [imageInputs, setImageInputs] = useState([{ id: nanoid() }]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      id: nanoid(),
      name: file.name,
      file,

    }))
    setImages((prevImages) => [...prevImages, ...newImages])
  }

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if(!productId){
      return;
    }
    if(Array.isArray(images) && images.length > 0){
      try{
        const result = await dispatch(uploadImages({productId,files: images.map((image) => image.file)})).unwrap()
        toast.success(result.message);
        setImages([])
        clearFileInputs();

      }catch(error){
        toast.error(error.mes)
      }
    }
  }


  const handleAddImageInput = () => {
    setImageInputs((prevInputs) => [...prevInputs, { id: nanoid() }]);
  };

  const handleRemoveImageInput = (id) => {
    setImageInputs(imageInputs.filter((input) => input.id !== id));
  };

  const clearFileInputs = () => {
    fileInputRefs.current.forEach((input) => {
      if (input) input.value = null;
    });
  };


  return (
    <form onSubmit={handleImageUpload}>
      <div className='mt-4'>
        <h5>Upload product image (s)</h5>

        <Link to={"#"} onClick={handleAddImageInput}>
          <BsPlus className='icon' /> Add More Images
        </Link>

        <div className='mb-2 mt-2'>
          {imageInputs.map((input, index) => (
            <div
              key={input.id}
              className='d-flex align-items-center mb-2 input-group'>
              <input
                type='file'
                multiple
                accept='image/*'
                onChange={handleImageChange}
                className='me-2 form-control'
                ref={(el) => (fileInputRefs.current[index] = el)}
              />
              <button
                className='btn btn-danger'
                onClick={() => handleRemoveImageInput(input.id)}>
                <BsDash />
              </button>
            </div>
          ))}
        </div>

        {imageInputs.length > 0 && (
          <button type='submit' className='btn btn-primary btn-sm'>
            Upload Images
          </button>
        )}
      </div>
    </form>
  )
}

export default ImageUploader