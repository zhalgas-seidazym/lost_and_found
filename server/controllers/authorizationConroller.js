

const sendMail = require('../utils/sendMail')

const AuthCode = require('../models/AuthCode')
const User = require('../models/User')


const sendCode = async (req, res) => {
    let code = Math.floor(Math.random() * 1000000) + ''
    await sendMail(req.body.email, "Verification Code", code)
    
    await AuthCode({
        email: req.body.email,
        code: code
    }).save()

    res.status(200).json({message: "Verification send!"})
} 

const signUp = async (req, res) => {

}

module.exports = {
    signUp,
    sendCode
}