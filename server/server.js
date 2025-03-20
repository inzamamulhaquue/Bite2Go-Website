// const express = require('express');
// const connectDataBase = require('./config/db');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/authRoutes');
// const cors = require('cors');
// const locationRoutes = require('./routes/locationRoutes');
// const addressesRouter = require("./routes/addressesRoutes");
// const ProductRoutes = require('./routes/ProductRoutes'); //
// const isAdmin = require('./middleware/adminAuth');
// const adminRoutes = require('./routes/adminRoutes');
// const path = require('path');
// const cartRoutes = require('./routes/cartRoutes');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const userRoutes = require('./routes/userRoutes');
// // const paymentRoutes = require("./routes/paymentRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const authRefresh = require('./middleware/authRefresh');

// dotenv.config();
// connectDataBase();

// const app = express();

// app.use(cors({
//     origin: ['http://localhost:3000', 'https://bite2go-website-front1.onrender.com'],
//     credentials: true
// }));

// // ✅ Corrected Middleware Order - Static files should be served before defining routes
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "/client/build")));

// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });

// app.use(express.json());
// app.use(bodyParser.json());

// app.use('/images', express.static(path.join(__dirname, 'dataset', 'dataset\iconic-images-and-descriptions')));





// app.use('/api/auth', authRoutes); // auth routes
// app.use('/api/location', locationRoutes); //location routes
// app.use("/api/addresses", addressesRouter); //address
// app.use('/api/admin', adminRoutes); //admin 

// app.use('/api/products', ProductRoutes); // product get 

// app.use('/api/cart', cartRoutes); //cart
// app.use('/api/user', userRoutes); // user routes
// // app.use("/api/payment", paymentRoutes); //payment

// app.use("/api/orders", orderRoutes); //order

// app.use('/api', authRefresh); //authrefersh token
 
// const PORT = process.env.PORT || 5005;
// app.listen(PORT, () => {
//     console.log(`Server is Running Port: ${PORT}`);
// });


import express from 'express';
import connectDataBase from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import locationRoutes from './routes/locationRoutes.js';
import addressesRouter from "./routes/addressesRoutes.js";
import ProductRoutes from './routes/ProductRoutes.js';
import isAdmin from './middleware/adminAuth.js';
import adminRoutes from './routes/adminRoutes.js';
import path from 'path';
import cartRoutes from './routes/cartRoutes.js';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRefresh from './middleware/authRefresh.js';

dotenv.config();
connectDataBase();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'https://bite2go-website-front1.onrender.com'],
    credentials: true
}));

// ✅ Corrected Middleware Order - Static files should be served before defining routes
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.use(express.json());
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'dataset', 'dataset/iconic-images-and-descriptions')));

app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use("/api/addresses", addressesRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api', authRefresh);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is Running Port: ${PORT}`);
});
