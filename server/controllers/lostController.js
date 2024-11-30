const LostItem = require('../models/LostItem')

const deleteImage = require('../utils/deleteImage')

const lostItemAdd = async (req, res) => {
    try{
        const {name, description, category} = req.body
    
        const images = req.files.map(img => `img/lost/${img.filename}`)
    
        const lostItem = await new LostItem({
            name: name, 
            desctiption: description ? description : "",
            category: category,
            user: req.user.id,
            images: images
        }).save()
    
        res.status(200).json({
            id: lostItem.id,
            name: lostItem.name,
            description: lostItem.description,
            images: lostItem.images,
            user: lostItem.user,
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
            if(lostItem.user != req.user.id) {
                req.files.forEach(img => deleteImage('img/lost/' + img.filename))
                return res.status(400).json({message: 'Access denied.'})
            }

            const images = req.files.map(img => `img/lost/${img.filename}`)
            const {name, description, category} = req.body
    
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
                    category: category ? category : lostItem.category,
                    images: images,
                },
                {new: true}
            )
    
            res.status(200).json({
                id: lostItem.id,
                name: lostItem.name,
                description: lostItem.description,
                user: lostItem.user,
                images: lostItem.images,
                category: lostItem.category,
                createdAt: lostItem.createdAt,
                updatedAt: lostItem.updatedAt
            })
        }
        else {
            res.status(400).json({message: 'Lost item post with this id does not exist.'})
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
            if(lostItem.user != req.user.id) {
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

        page ? page = 0 : page = page - 1

        let lostItems = await LostItem.find(filter).skip(itemsPerPage * page).limit(itemsPerPage).populate('category')
        lostItems = lostItems.map((item) => {
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
        const lostItem = await LostItem.findById(req.params.id).populate('user').populate('category')

        const fullInfo = {
            id: lostItem.id,
            name: lostItem.name,
            description: lostItem.description,
            images: lostItem.images,
            user: {
                id: lostItem.user.id,
                email: lostItem.user.email,
                telegram: lostItem.user.telegram,
                phone: lostItem.user.phone
            },
            category: {
                id: lostItem.category.id,
                name: lostItem.category.name
            },
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