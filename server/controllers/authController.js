const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// register User
exports.registerUser = async (req, res) => {    
    try{
        const {name, email, password, mobile} = req.body;
    
        //check if user exist or not
        const existingUser = await User.findOne({mobile});
        if(existingUser){
            return res.status(400).json({message: `User Already Exist Here`});
        };

        const user = new User ({name, email, password, mobile});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(201).json({ token , user});

    } catch (err){
        res.status(401).json({message: 'Server Error'});
    }
};



// login User
exports.loginUser = async (req, res) => {
    try{
        const {mobile, password, } = req.body;
    
        //check if user exist or not
        const user = await User.findOne({mobile});
        if(!user){
            return res.status(400).json({message: `Invalid credentials`});
        };

        // check if password match
        const isMatch = await bcrypt.compare (password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid Passowrd'});
        };

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({ token , user});

    } catch (err){
        res.status(401).json({message: 'Server Error', error: err.message});
    }
};
