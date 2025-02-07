const mongoose = require('mongoose');

const connectDataBase = async () =>{
    try{
        await mongoose.connect(process.env.DB_URI);
        console.log(`DataBase is Connected with Server`);
    } catch (err){
        console.error(err.message);
    }
};

module.exports = connectDataBase;