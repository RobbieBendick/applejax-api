var express = require("express");
const User = require("../models/user");
var router = express.Router();


router.post("/login", async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

})

module.exports = router;