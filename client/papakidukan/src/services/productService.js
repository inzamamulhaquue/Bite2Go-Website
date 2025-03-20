import axios from "axios";

// const API_URL = "http://localhost:5005/api/products";

//ye thk hai
const API_URL = axios.create({ 
    baseURL: "https://bite2go-website-back1.onrender.com/api"
});


export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
      // const response = await API_URL.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
