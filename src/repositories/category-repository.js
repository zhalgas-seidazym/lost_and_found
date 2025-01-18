const BaseRepository = require('./base-repository');
const {CategoryModel} = require('../models/global-models');

class CategoryRepository extends BaseRepository {
    constructor() {
        super(CategoryModel);
    }
}

module.exports = CategoryRepository;