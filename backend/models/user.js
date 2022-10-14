const mongoose = require('mongoose')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        require: true,
        max: 32,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        require: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        require: true,
        max: 56,
        unique: true,
        lowercase: true
    }, 
    profile: {
        type: String,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    about: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    resetPasswordLink: {
        type: String,
        default: ''
    }
}, {timestamp: true})

userSchema.virtual('password')
    .set(function(password) {
        // create temp variable _password
        this._password = password
        // generate salt
        this.salt = this.makeSalt()
        //encrypt password
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password
    })

userSchema.methods = {
    authenticate: function(plainPassword) {
        return this.encryptPassword(plainPassword) === this.hashed_password
    },

    encryptPassword: function(password) {
        if(!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt)
                            .update(password)
                            .digest('hex')
        } catch(err) {
            return ''
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random() + '')
    }

}

module.exports = mongoose.model('User', userSchema)