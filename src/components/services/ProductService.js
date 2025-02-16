import api from "./api";

export const getDistinctProductByName = async () => {
    try {
        const response = await api.get("/products/distinct/products");
     
        
        // Kiểm tra nếu response.data có data
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            console.error("Invalid API response format:", response);
            return [];
        }
    } catch (error) {
        console.error("❌ Error fetching distinct product names:", error);
        return [];
    }
};
