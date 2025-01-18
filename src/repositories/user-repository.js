const BaseRepository = require('./base-repository');
const {UserModel} = require('../models/global-models');

class UserRepository extends BaseRepository {
    constructor(){
        super(UserModel);
    }


    async findByEmail(email) {
        try {
            if (!email) {
                throw new Error('Email is required');
            }
            return await this.model.findOne({email});
        } catch (error) {
            console.error('Error in findByEmail:', error.message);
            throw new Error('Error in findByEmail:', error.message);
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
            throw new Error('Error in findByPhoneNumber:', error.message);
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
            throw new Error('Error in findByTelegram:', error.message);
        }
    }
}

module.exports = UserRepository;