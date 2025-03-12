const csv = require("csv-parser");
const multer  = require("multer");
const Product = require("../models/Product");
const fs = require("fs");
const path = require('path');


//current CSV file path
const sourcePath = "C:/Users/Admin/Desktop/PapaKiDukaan/server/uploads/productData_20_bite2go.csv";


// Destination: Move it to the /uploads folder
const destinationPath = path.join(__dirname, "../uploads/productData_20_bite2go.csv");

// Move file from Downloads to Uploads folder (Before processing CSV)
fs.rename(sourcePath, destinationPath, (err) => {
  if (err) {
      console.error("❌ Error moving file:", err);
  } else {
      console.log("✅ File successfully moved to /uploads!");
  }
});

// ✅ Configure Multer for File Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ✅ Upload & Process CSV file
exports.uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const filePath = req.file.path;
  const products = [];

  try {
      // Read and parse CSV file
      fs.createReadStream(filePath)
          .pipe(csv()) // Parse CSV data
          .on("data", (row) => {
              // Map CSV columns to Product schema
              const product = {
                  name: row.title || "Unknown Product",
                  description: row.description || "No description available",
                  price: parseFloat(row["pricing.price"]) || 0,
                  category: row.brand || "General",
                  imageUrl: row.productImage || ""
              };
              products.push(product);
          })
          .on("end", async () => {
              try {
                  await Product.insertMany(products);
                  fs.unlinkSync(filePath);

                  res.json({ message: "✅ Products uploaded successfully!", count: products.length });
              } catch (err) {
                  res.status(500).json({ message: "❌ Error saving products to database", error: err });
              }
          });
  } catch (err) {
      res.status(500).json({ message: "❌ Error processing file", error: err });
  }
};

// ✅ Get All Products from DB
exports.getProducts = async (req, res) => {
  try {
      const products = await Product.find();
      res.json(products);
  } catch (err) {
      res.status(500).json({ message: "❌ Error fetching products", error: err });
  }
};

// ✅ Export Multer Upload Middleware
exports.upload = upload.single("file");