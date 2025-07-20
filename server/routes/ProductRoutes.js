// const express = require("express");
// const { uploadCSV, getProducts, upload } = require("../controllers/productController");
// const router = express.Router();

// router.post("/upload-csv", upload ,uploadCSV);
// router.get("/", getProducts);

// module.exports = router;

// routes/productRoutes.cjs (or .js with CommonJS)

import express from 'express';
import { getProducts, uploadCSV, uploadMiddleware } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/upload', uploadMiddleware, uploadCSV);

export default router;
