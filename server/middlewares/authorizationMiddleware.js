const User = require('../models/User')

const validateSendCode = async (req, res, next) => {
    try{
        const errors = {}
        if(!req.body.email || req.body.email.length == 0){
            errors.email = "Email is incorrect"
        }
        else{
            const user = await User.findOne({
                email: req.body.email
            })
            if(user){
                errors.user = "User with this email already exists"
            }
        }
    
        if(JSON.stringify(errors) !== JSON.stringify({})){
            console.log(errors, req.body.email)
            res.status(400).json(errors)
        }
        else next() 
    }
    catch(err){
        res.status(500).json({error: err})
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
            errors.verificationCode = "Verification Code is required."
        }

        const user = await User.findOne({
            email: req.body.email
        })
        if(user){
            errors.user = "User with this email already exists"
        }
    
    
        if(JSON.stringify(errors) !== JSON.stringify({})){
            console.log(errors, req.body.email)
            res.status(400).json(errors)
        }
        else next() 
    }
    catch(err){
        res.status(500).json({error: err})
    }
}

module.exports = {
    validateSendCode,
    validateSignUp
}