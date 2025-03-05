import React, { useEffect, useState } from 'react'

 const ProductImage = ({productId}) => {
    const [productImage, setProductImage] = useState(null)
    const BASE_Url= "https://gotnow-api.onrender.com"
    const localHost= "http://localhost:8080"
    useEffect(() => {
        const fetchProductImage = async (id) => {
            // console.log("Fetching image for product id: "+ id)
        try{
            
            const response = await fetch(
                BASE_Url+`/api/v1/images/image/download/${id}`
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
    
    <div>
        <img src={productImage} alt='Product Image' style={{
            width: "150px",
            height: "180px",
            objectFit: "cover",
            borderRadius: "5px",
        }}/>
    </div>


  )
}
export default ProductImage;