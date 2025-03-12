const express = require("express");
const { uploadCSV, getProducts, upload } = require("../controllers/productController");
const router = express.Router();

router.post("/upload-csv", upload ,uploadCSV);
router.get("/", getProducts);

module.exports = router;