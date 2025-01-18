const BaseRepository = require('./base-repository');
const {ItemModel} = require('../models/global-models');

class ItemRepository extends BaseRepository {
    constructor() {
        super(ItemModel);
    }
}

module.exports = ItemRepository;