const express = require('express');
const connectDataBase = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));


app.use(express.json());

dotenv.config();
connectDataBase();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () =>{
    console.log(`Server is Running Port: ${PORT}`);
});