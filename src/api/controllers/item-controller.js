const {ITEM_STATUS, ROLES, ITEM_TYPES, SORT} = require("../../utils/constants");
const {ObjectId} = require('mongoose').Types;

class ItemController{
    constructor(itemRepository, categoryRepository, roleRepository, gcsService) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.roleRepository = roleRepository;
        this.gcsService = gcsService;
    }

    async createItem (req, res){
        const {name, description, date, categoryId, type} = req.body;
        const fileUrls = req.fileUrls;
        const user = req.user;

        try{
            const categoryExists = await this.categoryRepository.findById(categoryId);
            if(!categoryExists){
                const deleteFiles = fileUrls.map((urls) => this.gcsService.deleteFile(urls.split('/')[4]));
                await Promise.all(deleteFiles);
                return res.status(404).json({detail: "Category not found."});
            }

            const item = await this.itemRepository.create({
                name,
                description,
                type,
                date,
                categoryId,
                images: fileUrls,
                userId: user.id,
            });

            res.status(200).json({
                detail: 'Item created successfully.',
                itemId: item.id,
            });
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }

    async updateItem(req, res){
        const {id} = req.params;
        const {name, description, date, categoryId, type} = req.body;
        const deleteImages = req.body.deleteImages || [];
        const fileUrls = req.fileUrls;

        try{
            const item = await this.itemRepository.findById(id);
            if(fileUrls.length === 0 && item.images.every((image) => deleteImages.includes(image))){
                return res.status(400).json({detail: "Images are required. You cannot delete all images without adding new ones."});
            }
            if(deleteImages.length !== 0){
                const deleteImagesCopy = deleteImages.map(async (image) => {
                    if(item.images.includes(image)){
                        item.images = item.images.filter((url) => url !== image);
                        await this.gcsService.deleteFile(image.split('/')[4]);
                    }
                });
                await Promise.all(deleteImagesCopy);
            }

            item.name = name || item.name;
            item.description = description || item.description;
            item.type = type || item.type;
            item.date = date || item.date;
            item.categoryId = categoryId || item.categoryId;
            item.images = fileUrls ? [...item.images, ...fileUrls] : item.images;
            item.status = ITEM_STATUS.WAITING
            await item.save();

            res.status(204).json({detail: 'Item updated successfully.'});
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }

    async deleteItem(req, res){
        const {id} = req.params;

        try{
            const item = await this.itemRepository.findByIdAndGetImages(id);

            const images = item.images.map((image) => this.gcsService.deleteFile(image.split('/')[4]));
            await Promise.all(images);
            await this.itemRepository.delete(id);

            res.status(204).json({detail: 'Item deleted successfully.'});
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }

    async updateItemStatus(req, res){
        const {id} = req.params;
        const {itemStatus} = req.body;

        try{
            if(!Object.values(ITEM_STATUS).includes(itemStatus)){
                return res.status(400).json({detail: "Incorrect item status."});
            }

            const item = await this.itemRepository.findById(id);
            item.status = itemStatus;
            await item.save();

            res.status(204).json({detail: 'Item approved successfully.'});
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }

    async getItemById(req, res){
        const {id} = req.params;
        const user = req.user;

        try{
            const item = await this.itemRepository.findById(id, ['userId', 'categoryId']);

            const role = await this.roleRepository.findById(user.roleId);
            if(item.status !== ITEM_STATUS.APPROVED){
                if(user.id !== item.userId.id && role.name !== ROLES.ADMIN){
                    return res.status(403).json({detail: "Access denied."});
                }
            }

            res.status(200).json({
                item: {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    type: item.type,
                    date: item.date,
                    category: {
                        id: item.categoryId.id,
                        name: item.categoryId.name,
                    },
                    images: item.images,
                    user: {
                        id: item.userId.id,
                        name: item.userId.name,
                        surname: item.userId.surname,
                        email: item.userId.email,
                        telegram: item.userId.telegram,
                        phoneNumber: item.userId.phoneNumber,
                    },
                    status: item.status,
                }
            })
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }

    async getMyItems(req, res){
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const type = req.query.type ? req.query.type : ITEM_TYPES.LOST;
        const user = req.user;

        try {
            if(!Object.values(ITEM_TYPES).includes(type)){
                return res.status(404).json({detail: "Type not found. It should be either 'lost' or 'found'."});
            }

            const filter = {
                userId: user.id,
                type: type
            };
            const options = {
                skip: (page - 1) * limit,
                limit: limit,
                sort: {createdAt: -1},
                populate: ['categoryId']
            };

            let items = await this.itemRepository.findAll(filter, options);
            items = items.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    type: item.type,
                    date: item.date,
                    category: {
                        id: item.categoryId.id,
                        name: item.categoryId.name,
                    }
                };
            });

            const totalItems = await this.itemRepository.countDocuments(filter);
            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).json({
                totalItems,
                limit,
                totalPages,
                page,
                type,
                items
            });
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }

    async searchItems(req, res){
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
        const query = req.query.query ? req.query.query : null;
        const categoryId = req.query.categoryId ? req.query.categoryId : null;
        const type = req.query.type ? req.query.type : ITEM_TYPES.LOST;
        const status = req.query.status ? req.query.status : ITEM_STATUS.APPROVED;
        const sort = req.query.sort ? req.query.sort : SORT.NEWEST;
        const dateFrom = req.query.dateFrom ? req.query.dateFrom : null;
        const dateTo = req.query.dateTo ? req.query.dateTo : null;

        const user = req.user;

        try{
            const filter = {};
            const options = {};

            if(!Object.values(ITEM_TYPES).includes(type)){
                return res.status(404).json({detail: "Type not found. It should be either 'lost' or 'found'."});
            }
            if(!Object.values(ITEM_STATUS).includes(status)){
                filter.status = ITEM_STATUS.APPROVED;
            }
            else filter.status = status;
            const role = await this.roleRepository.findById(user.roleId);
            if(filter.status !== ITEM_STATUS.APPROVED){
                if(role.name !== ROLES.ADMIN){
                    return res.status(403).json({detail: "Access denied."});
                }
            }
            if(query) {
                filter.$or = [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ];
            }
            if(categoryId && ObjectId.isValid(categoryId)) {
                filter.categoryId = categoryId;
            }
            if(dateFrom && dateFrom.length > 0){
                filter.date = {...filter.date, $gte: new Date(dateFrom)}
            }
            if(dateTo && dateTo.length > 0){
                filter.date = {...filter.date, $lte: new Date(dateTo)}
            }
            filter.type = type;

            if(!Object.values(SORT).includes(sort)){
                options.sort = {createdAt: -1};
            }
            else{
                if(sort === SORT.NEWEST){
                    options.sort = {createdAt: -1};
                }
                else if(sort === SORT.OLDEST){
                    options.sort = {createdAt: 1};
                }
            }

            options.skip = (page - 1) * limit;
            options.limit = limit;

            const itemsFromRepo = await this.itemRepository.findAll(filter, options);
            const items = itemsFromRepo.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    type: item.type,
                    date: item.date,
                    category: {
                        id: item.categoryId.id,
                        name: item.categoryId.name,
                    }
                };
            });

            const totalItems = await this.itemRepository.countDocuments(filter);
            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).json({
                totalItems,
                limit,
                totalPages,
                page,
                type,
                items
            });
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }
}

module.exports = ItemController;