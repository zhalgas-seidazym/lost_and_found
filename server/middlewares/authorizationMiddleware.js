const User = require('../models/User')
const AuthCode = require('../models/AuthCode')

const validateSendCode = async (req, res, next) => {
    try{
        const errors = {}
        if(!req.body.email || req.body.email.length == 0){
            errors.email = "Email is required."
        }
    
        if(Object.keys(errors).length > 0){
            res.status(400).json(errors)
        }
        else next() 
    }
    catch(err){
        res.status(500).json({message: err.message || 'An unexpected error occurred' })
    }
}

const validateSignUp = async (req, res, next) => {
    try{
        const errors = {}
        if(!req.body.email || req.body.email.length == 0){
            errors.email = "Email is required."
        }
        if(!req.body.password || req.body.password.length == 0){
            errors.password = "Password is required."
        }
        if(!req.body.code || req.body.code.length == 0){
            errors.verificationCode = "Verification code is required."
        }

        if(Object.keys(errors).length > 0){
            res.status(400).json(errors)
        }
        else next() 
    }
    catch(err){
        res.status(500).json({message: err.message || 'An unexpected error occurred' })
    }
}

const validateSignIn = async (req, res, next) => {
    try{
        const errors = {}
        if(!req.body.email || req.body.email.length == 0){
            errors.email = "Email is required."
        }

        if(!req.body.password || req.body.password.length == 0){
            errors.password = "Password is required."
        }
    
        if(Object.keys(errors).length > 0){
            res.status(400).json(errors)
        }
        else next()
    }
    catch(err){
        res.status(500).json({message: err.message || 'An unexpected error occurred' })
    }
}

module.exports = {
    validateSendCode,
    validateSignUp,
    validateSignIn
}