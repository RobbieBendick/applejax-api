var express = require("express");
const User = require("../models/user");
var router = express.Router();
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res, next) => {

    try {  
        // Validate data before we make a user
        const {error} = registerValidation(req.body)
        if (error) return res.status(400).send(error.details[0].message);

        
        // Check if email exists
        const emailExists = await User.findOne({email: req.body.email});
        if (emailExists) return res.status(400).send("Email already exists");

        // Check if username exists
        const usernameExists = await User.findOne({username: req.body.username});
        if (usernameExists) return res.status(400).send("Username already exists");

        // Hash PW
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //Create a new user
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword
        });

        // save user
        user.save();
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/login", async (req, res) => {
    // Validate data before we make a user
    const {error} = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    // Check if email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Email is not found");
    // PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid password")


    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
})

module.exports = router;