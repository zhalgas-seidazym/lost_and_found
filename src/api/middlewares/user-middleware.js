const {jwtEncode, jwtDecode} = require('./../../utils/jwt')

class UserMiddleware {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

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

    async isAuth(req, res, next){
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({"detail": "Unauthorized"});
            }
            const {userId} = jwtDecode(token);
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return res.status(401).json({"detail": "Unauthorized"});
            }
            req.user = user;
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({"detail": "Invalid token or unauthorized."});
        }
    }
}

module.exports = UserMiddleware;