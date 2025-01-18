class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findById(id) {
        try {
            if (!id) {
                throw new Error('ID is required');
            }
            return await this.model.findById(id);
        } catch (error) {
            console.error('Error in findById:', error.message);
            throw new Error('Error in findById:', error.message);
        }
    }

    async findAll(filter = {}, options = {}) {
        try {
            const { skip = 0, limit = 10, populate = null, sort = null } = options;

            const query = this.model.find(filter)
                .skip(skip)
                .limit(limit)
                .sort(sort);

            if (populate) {
                query.populate(populate);
            }

            return await query.exec();
        } catch (error) {
            console.error('Error in findAll:', error.message);
            throw new Error('Error in findAll:', error.message);
        }
    }

    async create(data) {
        try {
            if (!data || (typeof data !== 'object' && !Array.isArray(data))) {
                throw new Error('Invalid data.');
            }

            if (Array.isArray(data)) {
                return await this.model.insertMany(data);
            } else {
                const newDocument = new this.model(data);
                return await newDocument.save();
            }
        } catch (error) {
            console.error('Error creating document:', error.message);
            throw new Error('Error creating document:', error.message);
        }
    }

    async update(id, updateData) {
        try {
            if (!id) {
                throw new Error('ID is required');
            }
            if (!updateData || typeof updateData !== 'object') {
                throw new Error('Invalid update data');
            }
            return await this.model.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
        } catch (error) {
            console.error('Error updating document:', error.message);
            throw new Error('Error updating document:', error.message);
        }
    }

    async delete(id) {
        try {
            if (!id) {
                throw new Error('ID is required');
            }
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error in delete:', error.message);
            throw new Error('Error in delete:', error.message);
        }
    }
}

module.exports = BaseRepository;