const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    return bcrypt.hash(password.toString(), 10);
};

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword
}