const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const sendMail = require('../utils/sendMail')
const checkUserExist = require('../utils/checkUserExist')
const {jwtOptions} = require('../config/passport')

const AuthCode = require('../models/AuthCode')
const User = require('../models/User')


const sendCode = async (req, res) => {
    try{
        if(await checkUserExist(req.body.email)){
            res.status(400).json({message: "User with this email already exists."})
        }
        else {
            let code = Math.floor(Math.random() * 1000000) + ''
            await sendMail(req.body.email, "Verification Code", code)
            
            await new AuthCode({
                email: req.body.email,
                code: code
            }).save()
        
            res.status(200).json({message: "Verification sent."})
        }
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
} 

const signUp = async (req, res) => {
    try{
        const {code, email, password, name, surname} = req.body
        
        if(await checkUserExist(email)){
            return res.status(400).json({message: "User with this email already exists."})
        }

        const authCode = await AuthCode.findOne({
            email: email,
            code: code
        })
        if(!authCode){
            res.status(400).json({message: 'Verification code is wrong.'})
        }
        else {
            const createdAt = new Date(authCode.createdAt)
            const now = new Date()
            const expirationTime = 5 * 60 * 1000
            
            if (now - createdAt > expirationTime) {
                res.status(400).json({message: 'Verification code is expired.'})
            }
            else {
                await AuthCode.deleteOne({
                    email: email,
                    code: code
                })
            
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
        
                await new User({
                    name: name, 
                    surname: surname,
                    email: email,
                    password: hashedPassword,
                    telegram: "",
                    phone: ""
                }).save()
        
                res.status(200).json({message: 'User created succesfully.'})
            }
        }
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

const signIn = async (req, res) => {
    try{
        const {email, password} = req.body

        const user = await User.findOne({
            email: email
        })

        if(user){
            const isMatch = await bcrypt.compare(password, user.password)
            if(isMatch){
                const token = jwt.sign(
                    {
                        id: user.id, 
                        email: user.email,
                    }, 
                    jwtOptions.secretOrKey,
                    {
                       expiresIn: 24 * 60 * 60 * 10
                    }
                )
        
                res.status(200).json({token: token})
            }
            else {
                res.status(400).json({message: 'Incorrect password.'})
            }
        }
        else {
            res.status(400).json({message: 'User with this email does not exist.'})
        }
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

const forgotPasswordSendCode = async (req, res) => {
    try{
        if(await checkUserExist(req.body.email)){
            let code = Math.floor(Math.random() * 1000000) + ''
            await sendMail(req.body.email, "Verification Code", code)
            
            await new AuthCode({
                email: req.body.email,
                code: code
            }).save()
        
            res.status(200).json({message: "Verification sent."})
        }
        else {
            res.status(400).json({message: "User with this email does not exist."})
        }
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

const forgotPasswordVerifyCode = async (req, res) => {
    try{
        const {code, email} = req.body
        
        if(!await checkUserExist(email)){
            return res.status(400).json({message: "User with this email does not exist."})
        }

        const authCode = await AuthCode.findOne({
            email: email,
            code: code
        })
        if(!authCode){
            res.status(400).json({message: 'Verification code is wrong.'})
        }
        else {
            const createdAt = new Date(authCode.createdAt)
            const now = new Date()
            const expirationTime = 5 * 60 * 1000
            
            if (now - createdAt > expirationTime) {
                res.status(400).json({message: 'Verification code is expired.'})
            }
            else {
                await AuthCode.deleteOne({
                    email: email,
                    code: code
                })

                res.status(200).json({message: 'Verification done.'})
            }
        }
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

const forgotPasswordChangePassword = async (req, res) => {
    try{
        const {newPassword, email} = req.body
        
        const user = await User.findOne({
            email: email
        })

        if(!user){
            res.status(400).json({message: "User with this email does not exist."})
        }
        else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            
            await User.findByIdAndUpdate(
                user.id,
                {
                    password: hashedPassword
                }
            )

            res.status(200).json({message: 'Password changed successfully.'})
        }

    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

module.exports = {
    signUp,
    sendCode,
    signIn,
    forgotPasswordSendCode,
    forgotPasswordVerifyCode,
    forgotPasswordChangePassword
}