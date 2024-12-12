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
        const {query, dateFrom, dateTo} = req.query   

        if(query){
            options.$or = [
                { name: { $regex: query, $options: 'i' } }, 
                { description: { $regex: query, $options: 'i' } }
            ]
        }

        let categories = await Category.find().lean()

        categories = await Promise.all(categories.map(async (categ) => {
            options.categoryId = categ._id
            const lostOptions = {...options}
            if(dateFrom && dateFrom.length > 0){
                lostOptions.lostDate = {...lostOptions.lostDate, $gte: new Date(dateFrom)}
            }
            if(dateTo && dateTo.length > 0){
                lostOptions.lostDate = {...lostOptions.lostDate, $lte: new Date(dateTo)}
            }
            
            const foundOptions = {...options}
            if(dateFrom && dateFrom.length > 0){
                foundOptions.foundDate = {...foundOptions.foundDate, $gte: new Date(dateFrom)}
            }
            if(dateTo && dateTo.length > 0){
                foundOptions.foundDate = {...foundOptions.foundDate, $lte: new Date(dateTo)}
            }
            
            const lostItemsCount = await LostItem.countDocuments(lostOptions)
            const foundItemsCount = await FoundItem.countDocuments(foundOptions)
            
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