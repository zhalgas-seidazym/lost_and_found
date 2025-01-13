const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        unique: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@([a-zA-Z0-9.-]+\.)?sdu\.edu\.kz$/.test(value);
            },
            message: 'Email must be a valid sdu.edu.kz email address'
        }
    },
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    verifiedUser: {
        type: Boolean,
        default: false,
    },
    telegram: String,
    phoneNumber: String
});

module.exports = mongoose.model('User', userSchema);
