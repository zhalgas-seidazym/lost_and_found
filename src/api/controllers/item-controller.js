
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
        const user = req.user;
    }
}

module.exports = ItemController;