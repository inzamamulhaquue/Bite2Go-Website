const express = require('express');
const connectDataBase = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const locationRoutes = require('./routes/locationRoutes');
const addressesRouter = require("./routes/addressesRoutes");
const ProductRoutes = require('./routes/ProductRoutes'); //
const isAdmin = require('./middleware/adminAuth');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const cartRoutes = require('./routes/cartRoutes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
// const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRefresh = require('./middleware/authRefresh');

dotenv.config();
connectDataBase();

const app = express();

// app.use(cors({
//     origin: 'http://localhost:3000',
//     'https://bite2go-website-front1.onrender.com'
//     credentials: true
// }));

app.use(cors({
    origin: ['http://localhost:3000', 'https://bite2go-app-front1.onrender.com'],
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'dataset', 'dataset\iconic-images-and-descriptions')));





app.use('/api/auth', authRoutes); // auth routes
app.use('/api/location', locationRoutes); //location routes
app.use("/api/addresses", addressesRouter); //address
app.use('/api/admin', adminRoutes); //admin 

app.use('/api/products', ProductRoutes); // product get 

app.use('/api/cart', cartRoutes); //cart
app.use('/api/user', userRoutes); // user routes
// app.use("/api/payment", paymentRoutes); //payment

app.use("/api/orders", orderRoutes); //order

app.use('/api', authRefresh); //authrefersh token
 
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is Running Port: ${PORT}`);
});
