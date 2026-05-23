const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

//Register
router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;

        //check if user exists
        const existingUser = await User.findOne({username});
        if(existingUser) return res.status(400).json({message: 'Username already exists'});

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({username, password: hashedPassword, avatar: "", bio: "", status: "Online"});
        
        res.json({message: 'User registered successfully'});
    } catch (err) {
        res.status(500).json(err);
    }
});

//Login
router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if(!user) {
            return res.status(400).json({message: 'User not found!'});
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword) {
            return res.status(400).json({message: 'Invalid password!'});
        }

        //create jwt token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.json({token, user:{
            _id: user._id,
            username: user.username,
            avatar: user.avatar || "",
            bio: user.bio || "",
            status: user.status || "Online",
        }});
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;