const LostItem = require('../models/LostItem')

const deleteImage = require('../utils/deleteImage')

const lostItemAdd = async (req, res) => {
    try{
        const {name, description, categoryId, lostDate} = req.body
        const images = req.files.map(img => `img/lost/${img.filename}`)
        
        const lostItem = await new LostItem({
            name: name, 
            description: description ? description : "",
            categoryId: categoryId,
            userId: req.user.id,
            images: images,
            lostDate: new Date(lostDate)
        }).save()
    
        res.status(200).json({
            id: lostItem.id,
            name: lostItem.name,
            description: lostItem.description,
            categoryId: lostItem.categoryId,
            images: lostItem.images,
            userId: lostItem.user,
            lostDate: lostItem.lostDate,
            createdAt: lostItem.createdAt,
            updatedAt: lostItem.updatedAt
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

const lostItemUpdate = async (req, res) => {
    try{
        let lostItem = await LostItem.findById(req.params.id)

        if(lostItem){
            if(lostItem.userId != req.user.id) {
                req.files.forEach(img => deleteImage('img/lost/' + img.filename))
                return res.status(400).json({message: 'Access denied.'})
            }

            const images = req.files.map(img => `img/lost/${img.filename}`)
            const {name, description, categoryId, lostDate} = req.body
    
            if(images.length == 0){
                images = lostItem.images
            }
            else {
                lostItem.images.forEach(image => {
                    deleteImage(image)
                })
            }
    
            lostItem = await LostItem.findByIdAndUpdate(
                lostItem.id,
                {
                    name: name ? name : lostItem.name,
                    description: description ? description : lostItem.description,
                    categoryId: categoryId ? categoryId : lostItem.categoryId,
                    images: images,
                    lostDate: lostDate ? new Date(lostDate) : lostItem.lostDate
                },
                {new: true}
            )
    
            res.status(200).json({
                id: lostItem.id,
                name: lostItem.name,
                description: lostItem.description,
                userId: lostItem.userId,
                images: lostItem.images,
                categoryId: lostItem.categoryId,
                lostDate: lostItem.lostDate,
                createdAt: lostItem.createdAt,
                updatedAt: lostItem.updatedAt
            })
        }
        else {
            res.status(404).json({message: 'Lost item post with this id does not exist.'})
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

const lostItemDelete = async (req, res) => {
    try{
        const lostItem = await LostItem.findById(req.params.id)

        if(lostItem){
            if(lostItem.userId != req.user.id) {
                return res.status(400).json({message: 'Access denied.'})
            }
    
            lostItem.images.forEach(img => deleteImage(img))
    
            await LostItem.findByIdAndDelete(req.params.id)
    
            res.status(200).json({message: 'Lost item post deleted successfully.'})
        }
        else {
            res.status(400).json({message: 'Lost item post with this id does not exist.'})
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

const lostItemSearch = async (req, res) => {
    try{
        const {query, categoryId} = req.query
        let {page} = req.query
        let {sort, dateFrom, dateTo} = req.query
        
        const filter = {}
        const itemsPerPage = 20

        if(dateFrom && dateFrom.length > 0){
            filter.lostDate = {...filter.lostDate, $gte: new Date(dateFrom)}
        }
        if(dateTo && dateTo.length > 0){
            filter.lostDate = {...filter.lostDate, $lte: new Date(dateTo)}
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

        let lostItems = await LostItem.find(filter).sort({createdAt: sort}).skip(itemsPerPage * page).limit(itemsPerPage).populate('categoryId')
        
        lostItems = lostItems.map((item) => {
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
                lostDate: item.lostDate,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }  
        })

        const totalItems = await LostItem.countDocuments(filter)
        const totalPages = Math.ceil(totalItems / itemsPerPage)

        res.status(200).json({
            totalItems,
            totalPages,
            page: page + 1,
            lostItems
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

const lostItemGetById = async (req, res) => {
    try{
        const lostItem = await LostItem.findById(req.params.id).populate('userId').populate('categoryId')

        const fullInfo = {
            id: lostItem.id,
            name: lostItem.name,
            description: lostItem.description,
            images: lostItem.images,
            user: {
                id: lostItem.userId.id,
                name: lostItem.userId.name,
                surname: lostItem.userId.surname,
                email: lostItem.userId.email,
                telegram: lostItem.userId.telegram,
                phone: lostItem.userId.phone
            },
            category: {
                id: lostItem.categoryId.id,
                name: lostItem.categoryId.name
            },
            lostDate: lostItem.lostDate,
            createdAt: lostItem.createdAt,
            updatedAt: lostItem.updatedAt
        }

        res.status(200).json(fullInfo)
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
}

module.exports = {
    lostItemAdd,
    lostItemUpdate,
    lostItemDelete,
    lostItemSearch,
    lostItemGetById
}