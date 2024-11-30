

const Category = require('../models/Category')
const LostItem = require('../models/LostItem')
const FoundItem = require('../models/FoundItem')


const createCategories = async () => {
    try{
        let categories = await Category.find()
    
        if(categories.length == 0){
            categories = ['Electronics', 'Documents', 'Clothing and accessories']
        
            await Category.insertMany(
                categories.map(name => ({ name }))
            )
        }
    }
    catch(e){}
}

const getCategories = async (req, res) => {
    try {
        const options = {}
        const {query} = req.query

        if(query){
            options.$or = [
                { name: { $regex: query, $options: 'i' } }, 
                { description: { $regex: query, $options: 'i' } }
            ]
        }

        let categories = await Category.find().lean()

        categories = await Promise.all(categories.map(async (categ) => {
            options.category = categ._id
            const lostItemsCount = await LostItem.countDocuments(options)

            const foundItemsCount = await FoundItem.countDocuments(options)

            return {
                id: categ._id,
                name: categ.name,
                lostItemsCount: lostItemsCount,
                foundItemsCount: foundItemsCount
            }
        }))

        res.status(200).json(categories)

    } 
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}


module.exports = {
    createCategories,
    getCategories
}