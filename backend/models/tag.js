const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true,
        unique: true,
        max: 32
    }
}, {timestamp: true})

module.exports = mongoose.model('Tag', tagSchema)