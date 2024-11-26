
const validateChangePassword = (req, res, next) => {
    try{
        const errors = {}
        if(!req.body.currentPassword || req.body.currentPassword.length == 0){
            errors.currentPassword = "Current Password is required."
        }
        if(!req.body.newPassword || req.body.newPassword.length == 0){
            errors.newPassword = "New Password is required."
        }
    
        if(Object.keys(errors).length > 0){
            res.status(400).json(errors)
        }
        else next() 
    }
    catch(err){
        res.status(500).json({message: err.message || 'An unexpected error occurred.' })
    }
}

const validateChangeTelegram = (req, res, next) => {
    try{
        const errors = {}
        if(!req.body.telegram || req.body.telegram.length == 0){
            errors.telegram = "Telegram nickname is required."
        }
    
        if(Object.keys(errors).length > 0){
            res.status(400).json(errors)
        }
        else next() 
    }
    catch(err){
        res.status(500).json({message: err.message || 'An unexpected error occurred.' })
    }
}

const validateChangePhone = (req, res, next) => {
    try{
        const errors = {}
        if(!req.body.phone || req.body.phone.length == 0){
            errors.phone = "Phone number is required."
        }
    
        if(Object.keys(errors).length > 0){
            res.status(400).json(errors)
        }
        else next() 
    }
    catch(err){
        res.status(500).json({message: err.message || 'An unexpected error occurred.' })
    }
}

module.exports = {
    validateChangePassword,
    validateChangeTelegram,
    validateChangePhone
}