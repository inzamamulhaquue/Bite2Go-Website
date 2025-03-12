const mongoose = require('mongoose');

// Define the schema for the products
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
