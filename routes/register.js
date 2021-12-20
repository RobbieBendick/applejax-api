var express = require("express");
const User = require("../models/user");
var router = express.Router();


router.post("/register", async (req, res, next) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })

    try {
        // check if email is in use
        User.findOne({
                email: req.body.email
            }, (err, foundUser) => {
                if (foundUser) {
                    res.send("Email already in use!")
                } else {
                    // check if username is in use
                    User.findOne({
                        username: req.body.username
                    }, (err, foundUsername) => {
                        if (foundUsername) {
                            res.send("Username already in use!")
                        } else {
                            res.send("Saving user!");
                            user.save();
                        }
                    })
                }
            })
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;