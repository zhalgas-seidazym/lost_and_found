class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findById(id) {
        try{
            const res = await this.model.findById(id);
            return res ? res : null;
        }catch (error){
            console.error('Error in findById:', error.message);
            throw new Error('Unable to fetch data.');
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
            throw new Error('Unable to fetch data.');
        }
    }


    async create(user) {
        const newData = new this.model(user);
        return await newData.save();
    }

    async update(id, updateData) {
        const updatedData = await this.model.findByIdAndUpdate(id, updateData, {
            new: true, runValidators: true,
        });
        return updatedData ? updatedData : null;
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

module.exports = BaseRepository;