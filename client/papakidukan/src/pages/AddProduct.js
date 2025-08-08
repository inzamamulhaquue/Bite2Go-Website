import React, { useState } from "react";
import axios from "axios";
import "../styles/AddProduct.css";

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        quantityType: "",
        image: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("quantityType", formData.quantityType);
        data.append("image", formData.image);

        try {
            // await axios.post("http://localhost:5000/api/products/add", data);
            await axios.post("https://bite2go-website.onrender.com/api/products/add", data);
            alert("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
                <input type="text" name="quantityType" placeholder="Quantity Type" onChange={handleChange} required />
                <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
