const User = require("../models/user")


exports.read = (req, res) => {
    res.json(req.profile)
}