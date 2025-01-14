class UserMiddleware {
    validateSignUp (req, res, next) {
        try{
            const errors = {}
            if(!req.body.name || req.body.name.length === 0){
                errors.name = "Name is required."
            }
            if(!req.body.surname || req.body.surname.length === 0){
                errors.surname = "Surname is required."
            }
            if(!req.body.email || req.body.email.length === 0){
                errors.email = "Email is required."
            }
            if(!req.body.password || req.body.password.length === 0){
                errors.password = "Password is required."
            }

            if(Object.keys(errors).length > 0){
                res.status(400).json({detail: errors})
            }
            else next()
        }
        catch(err){
            res.status(500).json({detail: err.message || 'An unexpected error occurred.' })
        }
    }
}

module.exports = UserMiddleware;