const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    telegram: String,
    phone: String
})

module.exports = mongoose.model('User', userSchema)