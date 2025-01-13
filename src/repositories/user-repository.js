const BaseRepository = require('./base-repository');
const {UserModel} = require('../models/global-models');

class UserRepository extends BaseRepository {
    constructor(){
        super(UserModel);
    }

    async

    async findByEmail(email) {
        try {
            if (!email) {
                throw new Error('Email is required');
            }
            return await this.model.findOne({email});
        } catch (error) {
            console.error('Error in findByEmail:', error.message);
            throw new Error('Unable to fetch the document by email. Please try again later.');
        }
    }

    async findByPhoneNumber(phoneNumber) {
        try {
            if (!phoneNumber) {
                throw new Error('Phone number is required');
            }
            return await this.model.findOne({phoneNumber});
        } catch (error) {
            console.error('Error in findByPhoneNumber:', error.message);
            throw new Error('Unable to fetch the document by phone number. Please try again later.');
        }
    }

    async findByTelegram(telegram) {
        try {
            if (!telegram) {
                throw new Error('Telegram is required');
            }
            return await this.model.findOne({telegram});
        } catch (error) {
            console.error('Error in findByTelegram:', error.message);
            throw new Error('Unable to fetch the document by telegram. Please try again later.');
        }
    }
}

module.exports = UserRepository;