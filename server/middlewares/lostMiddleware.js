

const validateLostAdd = (req, res, next) => {
    try{
        const errors = {}
        if(!req.body.name || req.body.name.length == 0){
            errors.name = "Name is required."
        }
        if(!req.body.categoryId || req.body.categoryId.length == 0){
            errors.categoryId = "Category ID is required."
        }
        if(!req.body.lostDate || req.body.lostDate.length == 0){
            errors.lostDate = "Lost date is required."
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
    validateLostAdd
}