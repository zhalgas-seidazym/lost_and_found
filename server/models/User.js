const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    surname: {
        type: String, 
        required: true
    },
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