const User = require('../models/user')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')



exports.signup = (req, res) => {
    User.findOne({email: req.body.email}).exec((err, user) => {
        if(user) {
            return res.status(400).json({
                error: 'Username already exists!'
            })
        }
        const {name, email, password} = req.body
        let username = shortId.generate()
        let profile = `${process.env.CLIENT_URL}/profile/${username}`

        let newUser = new User({name, email, password, profile, username})
        newUser.save((err, success) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            return res.json({
                message: 'Signup successful!'
            })
        })
    })
}

exports.signin = (req, res) => {
    const {email, password} = req.body

    // check if user exists
    User.findOne({email: email}).exec((err, user) => {
        if(err || !user) {
            console.log(err)
            return res.status(400).json({
                message: 'User does not exist!'
            })
        }

        // authenticate
        if(!user.authenticate(password)) {
            return res.status(400).json({
                message: 'Email/Password is incorrect!'
            })
        }

        // generate jwt
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.cookie('token', token, {expiresIn: '1d'})

        const {_id, username, name, email, role} = user
        return res.json({
            token,
            user: {_id, username, name, email, role}
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie('token')
    return res.json({
        message: 'Sign out succesful'
    })
}

exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
})

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.auth._id
    User.findById({_id: authUserId}).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found!'
            })
        }
        req.profile = user
        next()
    })
}

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.auth._id
    User.findById({_id: adminUserId}).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found!'
            })
        }
        if(user.role !== 1) {
            return res.status(403).json({
                error: 'Admin resource access denied!'
            })
        }
        req.profile = user
        next()
    })
}