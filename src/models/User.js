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
                return /^.+@sdu\.edu\.kz$/.test(value);
            },
            message: 'Email must be a valid sdu.edu.kz email address'
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    verifiedUser: {
        type: Boolean,
        default: false,
    },
    telegram: String,
    phone: String
});

module.exports = mongoose.model('User', userSchema);
