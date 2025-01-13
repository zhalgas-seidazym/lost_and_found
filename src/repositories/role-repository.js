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

            const roleId = await this.model.find({name});
            return roleId[0];
        }catch (error){
            console.log('Error in findByName:', error.message);
            throw new Error('Unable to fetch the document. Please try again later.');
        }
    }
}

module.exports = RoleRepository;