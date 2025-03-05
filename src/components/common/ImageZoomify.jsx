import React, { useEffect, useState } from 'react'
import ImageZoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
const ImageZoomify = ({productId}) => {

    const BASE_Url= "https://gotnow-api.onrender.com"
    const localHost= "http://localhost:8080"
    const [productImage, setProductImage] = useState(null)
        
        useEffect(() => {
            const fetchProductImage = async (id) => {
                console.log("Fetching image for product id: "+ id)
            try{
                
                const response = await fetch(
                    localHost+`/api/v1/images/image/download/${id}`
                )
                console.log("image"+response)
                const blob = await response.blob()
                const reader= new FileReader()
                reader.onload = () => {
                    setProductImage(reader.result)
                };
                reader.readAsDataURL(blob)
    
            }catch(error){
                console.error("Error fetch image: "+ error)
            }
        }
    
            if(productId){
                fetchProductImage(productId)
            }
            },[productId]);
    
    
            if(!productId){
                return null
            }
  return (
    <ImageZoom>
        <img src={productImage} alt='Product Image' className='resized-image'/>
    </ImageZoom>
  )
}

export default ImageZoomify