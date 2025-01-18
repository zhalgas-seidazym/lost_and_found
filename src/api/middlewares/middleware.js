const {jwtEncode, jwtDecode} = require('./../../utils/jwt')
const { ObjectId } = require('mongoose').Types;

class Middleware {
    constructor(userRepository, roleRepository, itemRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.itemRepository = itemRepository;
    }

    validateSignUp (req, res, next) {
        try{
            const errors = {};
            if(!req.body.name || req.body.name.length === 0){
                errors.name = "Name is required.";
            }
            if(!req.body.surname || req.body.surname.length === 0){
                errors.surname = "Surname is required.";
            }
            if(!req.body.email || req.body.email.length === 0){
                errors.email = "Email is required.";
            }
            if(!req.body.password || req.body.password.length === 0){
                errors.password = "Password is required.";
            }

            if(Object.keys(errors).length > 0){
                res.status(400).json({detail: errors});
            }
            else next();
        }
        catch(err){
            res.status(500).json({detail: err.message || 'An unexpected error occurred.' });
        }
    }

    validateCreateItem(req, res, next){
        try{
            const errors = {};
            if(!req.body.name || req.body.name.length === 0){
                errors.name = "Name is required.";
            }
            if(!req.body.categoryId || req.body.categoryId.length === 0){
                errors.categoryId = "Category ID is required.";
            }
            if(!req.body.date || req.body.date.length === 0){
                errors.date = "Date is required.";
            }
            if(!req.fileUrls || req.fileUrls.length === 0){
                errors.images = "Images are required.";
            }
            if(!req.body.type || (req.body.type !== 'lost' && req.body.type !== 'found')){
                errors.type = "Type is incorrect. It should be either 'lost' or 'found'.";
            }

            if(Object.keys(errors).length > 0){
                res.status(400).json(errors);
            }
            else next();
        }catch (err){
            res.status(500).json({detail: err.message || 'An unexpected error occurred.' });
        }
    }

    async isAuth(req, res, next){
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({"detail": "Unauthorized."});
            }
            const {userId} = jwtDecode(token);
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return res.status(401).json({"detail": "Unauthorized."});
            }
            req.user = user;
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({"detail": "Invalid token or unauthorized."});
        }
    }

    async validateId(req, res, next){
        try{
            if(!ObjectId.isValid(req.params.id)){
                return res.status(404).json({"detail": "Incorrect id."});
            }
            next();
        }catch (err){
            res.status(500).json({detail: err.message || 'An unexpected error occurred.' });
        }
    }

    async checkOwnership(req, res, next){
        const {id} = req.params;
        const user = req.user;

        try{
            const item = await this.itemRepository.findById(id);
            if(!item){
                return res.status(404).json({"detail": "Item not found."});
            }
            if(item.userId.toString() !== user.id){
                return res.status(403).json({"detail": "Forbidden."});
            }

            next();
        }catch (err){
            res.status(500).json({detail: err.message || 'An unexpected error occurred.' });
        }
    }
}

module.exports = Middleware;