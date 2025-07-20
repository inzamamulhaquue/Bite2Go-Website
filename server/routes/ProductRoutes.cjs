// const express = require("express");
// const { uploadCSV, getProducts, upload } = require("../controllers/productController");
// const router = express.Router();

// router.post("/upload-csv", upload ,uploadCSV);
// router.get("/", getProducts);

// module.exports = router;

// routes/productRoutes.cjs (or .js with CommonJS)

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.cjs');

router.get('/', productController.getProducts);
router.post('/upload', productController.upload, productController.uploadCSV);

module.exports = router;
