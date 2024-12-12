const FoundItem = require('../models/FoundItem')

const deleteImage = require('../utils/deleteImage')

const foundItemAdd = async (req, res) => {
    try{
        const {name, description, categoryId, foundDate} = req.body
        const images = req.files.map(img => `img/found/${img.filename}`)
    
        const foundItem = await new FoundItem({
            name: name, 
            description: description ? description : "",
            categoryId: categoryId,
            userId: req.user.id,
            images: images,
            foundDate: new Date(foundDate)
        }).save()
    
        res.status(200).json({
            id: foundItem.id,
            name: foundItem.name,
            userId: foundItem.userId,
            categoryId: foundItem.categoryId,
            images: foundItem.images,
            foundDate: foundItem.foundDate,
            createdAt: foundItem.createdAt,
            updatedAt: foundItem.updatedAt
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

const foundItemUpdate = async (req, res) => {
    try{
        let foundItem = await FoundItem.findById(req.params.id)

        if(foundItem){
            if(foundItem.userId != req.user.id) {
                req.files.forEach(img => deleteImage('img/found/' + img.filename))
                return res.status(400).json({message: 'Access denied.'})
            }

            const images = req.files.map(img => `img/found/${img.filename}`)
            const {name, description, categoryId, foundDate} = req.body
    
            if(images.length == 0){
                images = foundItem.images
            }
            else {
                foundItem.images.forEach(image => {
                    deleteImage(image)
                })
            }
    
            foundItem = await FoundItem.findByIdAndUpdate(
                foundItem.id,
                {
                    name: name ? name : foundItem.name,
                    description: description ? description : foundItem.description,
                    categoryId: categoryId ? categoryId : foundItem.categoryId,
                    images: images,
                    foundDate: foundDate ? new Date(foundDate) : foundItem.foundDate
                },
                {new: true}
            )
    
            res.status(200).json({
                id: foundItem.id,
                name: foundItem.name,
                description: foundItem.description,
                userId: foundItem.userId,
                categoryId: foundItem.categoryId,
                images: foundItem.images,
                foundDate: foundItem.foundDate,
                createdAt: foundItem.createdAt,
                updatedAt: foundItem.updatedAt,
            })
        }
        else {
            res.status(404).json({message: 'Found item post with this id does not exist.'})
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

const foundItemDelete = async (req, res) => {
    try{
        const foundItem = await FoundItem.findById(req.params.id)

        if(foundItem){
            if(foundItem.userId != req.user.id) {
                return res.status(400).json({message: 'Access denied.'})
            }
    
            foundItem.images.forEach(img => deleteImage(img))
    
            await FoundItem.findByIdAndDelete(req.params.id)
    
            res.status(200).json({message: 'Found item post deleted successfully.'})
        }
        else {
            res.status(400).json({message: 'Found item post with this id does not exist.'})
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

const foundItemSearch = async (req, res) => {
    try{
        const {query, categoryId} = req.query
        let {page} = req.query
        let {sort, dateFrom, dateTo} = req.query
        
        const filter = {}
        const itemsPerPage = 20
        
        if(dateFrom && dateFrom.length > 0){
            filter.foundDate = {...filter.foundDate, $gte: new Date(dateFrom)}
        }
        if(dateTo && dateTo.length > 0){
            filter.foundDate = {...filter.foundDate, $lte: new Date(dateTo)}
        }

        if(query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } }, 
                { description: { $regex: query, $options: 'i' } }
            ]
        }
        
        if(categoryId) {
            filter.categoryId = categoryId
        }

        if(sort === "asc"){
            sort = 1
        }
        else{
            sort = -1
        }

        !page ? page = 0 : page = page - 1

        let foundItems = await FoundItem.find(filter).sort({createdAt: sort}).skip(itemsPerPage * page).limit(itemsPerPage).populate('categoryId')

        foundItems = foundItems.map((item) => {
            return {
                id: item._id,
                name: item.name,
                description: item.description,
                userId: item.userId,
                category: {
                    id: item.categoryId._id,
                    name: item.categoryId.name
                },
                images: item.images,
                foundDate: item.foundDate,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }  
        })

        const totalItems = await FoundItem.countDocuments(filter)
        const totalPages = Math.ceil(totalItems / itemsPerPage)

        res.status(200).json({
            totalItems,
            totalPages,
            page: page + 1,
            foundItems
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

const foundItemGetById = async (req, res) => {
    try{
        const foundItem = await FoundItem.findById(req.params.id).populate('userId').populate('categoryId')

        const fullInfo = {
            id: foundItem.id,
            name: foundItem.name,
            description: foundItem.description,
            images: foundItem.images,
            user: {
                id: foundItem.userId.id,
                name: foundItem.userId.name,
                surname: foundItem.userId.surname,
                email: foundItem.userId.email,
                telegram: foundItem.userId.telegram,
                phone: foundItem.userId.phone
            },
            category: {
                id: foundItem.categoryId.id,
                name: foundItem.categoryId.name
            },
            foundDate: foundItem.foundDate,
            createdAt: foundItem.createdAt,
            updatedAt: foundItem.updatedAt
        }

        res.status(200).json(fullInfo)
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

module.exports = {
    foundItemAdd,
    foundItemUpdate,
    foundItemDelete,
    foundItemSearch,
    foundItemGetById
}