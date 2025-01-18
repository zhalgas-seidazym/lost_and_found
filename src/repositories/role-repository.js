const BaseRepository = require('./base-repository');
const {RoleModel} = require('../models/global-models')

class RoleRepository extends BaseRepository {
    constructor() {
        super(RoleModel);
    }

    async findByName(name){
        try{
            if(!name){
                throw new Error('Role name is required');
            }

            return await this.model.findOne({name});
        }catch (error){
            console.log('Error in findByName:', error.message);
            throw new Error('Error in findByName:', error.message);
        }
    }
}

module.exports = RoleRepository;