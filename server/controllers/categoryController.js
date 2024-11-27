

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
        let categories = await Category.find()


        categories = await Promise.all(categories.map(async (categ) => {
            const lostItemsCount = await LostItem.countDocuments({ category: categ.id })

            const foundItemsCount = await FoundItem.countDocuments({ category: categ.id })

            return {
                id: categ.id,
                name: categ.name,
                lostCount: lostItemsCount,
                foundCount: foundItemsCount
            }
        }))

        res.status(200).json(categories)

    } catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}


module.exports = {
    createCategories,
    getCategories
}