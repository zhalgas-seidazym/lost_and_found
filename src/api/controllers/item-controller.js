
class ItemController{
    constructor(itemRepository, categoryRepository, gcsService) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
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
                return res.status(404).json({"detail": "Category not found."});
            }

            await this.itemRepository.create({
                name,
                description,
                type,
                date,
                categoryId,
                images: fileUrls,
                userId: user.id,
                approved: false,
            });

            res.status(200).json({message: 'Item created successfully.'});
        }catch (error){
            console.log(error.message);
            return res.status(500).json({"detail": "Internal server error."});
        }
    }

    async deleteImage(req, res){
        const {id} = req.params;
        const {image} = req.body;

        try{
            const item = await this.itemRepository.findById(id);
            if(!item.images.includes(image)){
                return res.status(404).json({"detail": "Image not found."});
            }
            item.images = item.images.filter((url) => url !== image);
            await item.save();
            await this.gcsService.deleteFile(image.split('/')[4]);

            return res.status(200).json({message: 'Image deleted successfully.'});
        }catch (error){
            console.log(error.message);
            return res.status(500).json({"detail": "Internal server error."});
        }
    }

    async updateItem(req, res){
        const {id} = req.params;
        const {name, description, date, categoryId, type} = req.body;
        const fileUrls = req.fileUrls;

        try{
            const item = await this.itemRepository.findById(id);
            if(fileUrls.length === 0 && item.images.length === 0){
                return res.status(400).json({"detail": "Images are required."});
            }

            item.name = name || item.name;
            item.description = description || item.description;
            item.type = type || item.type;
            item.date = date || item.date;
            item.categoryId = categoryId || item.categoryId;
            item.images = fileUrls || item.images;
            await item.save();

            res.status(204).json({message: 'Item updated successfully.'});
        }catch (error){
            console.log(error.message);
            return res.status(500).json({"detail": "Internal server error."});
        }
    }
}

module.exports = ItemController;