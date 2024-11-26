const User = require('../models/User')

const checkUserExist = async(email) => {
    const user = await User.findOne({
        email: email
    })
    
    return user ? true : false
}

module.exports = checkUserExist
