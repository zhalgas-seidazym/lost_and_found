const mongoose = require('mongoose');

const config = require('./config');

const connectToDB = async () => {
    await mongoose.connect(config.mongodb).then(() =>
        console.log('MongoDB Connected')
    ).catch(err => console.log(err));
}

module.exports = {
    connectToDB
}
