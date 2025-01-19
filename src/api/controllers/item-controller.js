const {ITEM_STATUS, ROLES} = require("../../utils/constants");

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

    async deleteImage(req, res){
        const {id} = req.params;
        const {image} = req.body;

        try{
            const item = await this.itemRepository.findById(id);
            if(!item.images.includes(image)){
                return res.status(404).json({detail: "Image not found."});
            }
            item.images = item.images.filter((url) => url !== image);
            await item.save();
            await this.gcsService.deleteFile(image.split('/')[4]);

            return res.status(200).json({detail: 'Image deleted successfully.'});
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }

    async updateItem(req, res){
        const {id} = req.params;
        const {name, description, date, categoryId, type} = req.body;
        const fileUrls = req.fileUrls;

        try{
            const item = await this.itemRepository.findById(id);
            if(fileUrls.length === 0 && item.images.length === 0){
                return res.status(400).json({detail: "Images are required."});
            }

            item.name = name || item.name;
            item.description = description || item.description;
            item.type = type || item.type;
            item.date = date || item.date;
            item.categoryId = categoryId || item.categoryId;
            item.images = fileUrls || item.images;
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
}

module.exports = ItemController;