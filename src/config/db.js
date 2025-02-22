const mongoose = require('mongoose');
// import mongoose from 'mongoose';

const config = require('./config');

const connectToDB = async () => {
    try{
        await mongoose.connect(config.mongodb).then(() =>
            console.log('MongoDB Connected')
        ).catch(err => console.log(err));
    }catch(err){
        process.exit(1);
    }
};

module.exports = {
    connectToDB
};
