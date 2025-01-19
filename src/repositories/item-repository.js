const BaseRepository = require('./base-repository');
const {ItemModel} = require('../models/global-models');

class ItemRepository extends BaseRepository {
    constructor() {
        super(ItemModel);
    }

    async findByIdAndGetImages(id){
        try{
            if(!id){
                throw new Error('Item id is required');
            }

            return await this.model.findById(id).select('images');
        }catch (error){
            console.log('Error in findByIdAndGetImages:', error.message);
            throw new Error('Error in findByIdAndGetImages:', error.message);
        }
    }
}

module.exports = ItemRepository;