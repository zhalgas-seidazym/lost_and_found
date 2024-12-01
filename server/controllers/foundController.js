const FoundItem = require('../models/FoundItem')

const deleteImage = require('../utils/deleteImage')

const foundItemAdd = async (req, res) => {
    try{
        const {name, description, category} = req.body
    
        const images = req.files.map(img => `img/found/${img.filename}`)
    
        const foundItem = await new FoundItem({
            name: name, 
            description: description ? description : "",
            category: category,
            user: req.user.id,
            images: images
        }).save()
    
        res.status(200).json({
            id: foundItem.id,
            name: foundItem.name,
            user: foundItem.user,
            category: foundItem.category,
            images: foundItem.images,
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
            if(foundItem.user != req.user.id) {
                req.files.forEach(img => deleteImage('img/found/' + img.filename))
                return res.status(400).json({message: 'Access denied.'})
            }

            const images = req.files.map(img => `img/found/${img.filename}`)
            const {name, description, category} = req.body
    
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
                    category: category ? category : foundItem.category,
                    images: images,
                },
                {new: true}
            )
    
            res.status(200).json({
                id: foundItem.id,
                name: foundItem.name,
                description: foundItem.description,
                category: foundItem.category,
                images: foundItem.images,
                createdAt: foundItem.createdAt,
                updatedAt: foundItem.updatedAt,
            })
        }
        else {
            res.status(400).json({message: 'Found item post with this id does not exist.'})
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
            if(foundItem.user != req.user.id) {
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
        const {query, category} = req.query
        let {page} = req.query
        const itemsPerPage = 20

        const filter = {}

        if(query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } }, 
                { description: { $regex: query, $options: 'i' } }
            ]
        }
        
        if(category) {
            filter.category = category
        }

        !page ? page = 0 : page = page - 1

        let foundItems = await FoundItem.find(filter).skip(itemsPerPage * page).limit(itemsPerPage).populate('category').lean()
        foundItems = foundItems.map((item) => {
            return {
                id: item._id,
                name: item.name,
                description: item.description,
                user: item.user,
                category: {
                    id: item.category._id,
                    name: item.category.name,
                },
                images: item.images,
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
        const foundItem = await FoundItem.findById(req.params.id).populate('user').populate('category')

        const fullInfo = {
            id: foundItem.id,
            name: foundItem.name,
            description: foundItem.description,
            images: foundItem.images,
            user: {
                id: foundItem.user.id,
                email: foundItem.user.email,
                telegram: foundItem.user.telegram,
                phone: foundItem.user.phone
            },
            category: {
                id: foundItem.category.id,
                name: foundItem.category.name
            },
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