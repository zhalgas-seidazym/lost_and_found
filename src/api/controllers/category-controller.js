const {ITEM_TYPES, ITEM_STATUS, ROLES} = require("../../utils/constants");

class CategoryController {
    constructor(categoryRepository, itemRepository, roleRepository) {
        this.categoryRepository = categoryRepository;
        this.itemRepository = itemRepository;
        this.roleRepository = roleRepository;
    }

    async getCategories(req, res){
        const query = req.query.query ? req.query.query : null;
        const status = req.query.status ? req.query.status : ITEM_STATUS.APPROVED;
        const dateFrom = req.query.dateFrom ? req.query.dateFrom : null;
        const dateTo = req.query.dateTo ? req.query.dateTo : null;

        const user = req.user;

        try{
            const filter = {};
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
            if(dateFrom && dateFrom.length > 0){
                filter.date = {...filter.date, $gte: new Date(dateFrom)}
            }
            if(dateTo && dateTo.length > 0){
                filter.date = {...filter.date, $lte: new Date(dateTo)}
            }
            let categories = await this.categoryRepository.findAll();
            categories = categories.map(async (category) => {
                filter.categoryId = category.id;
                const count = await this.itemRepository.countDocuments(filter);
                return {
                    id: category.id,
                    name: category.name,
                    count: count,
                };
            });
            categories = await Promise.all(categories);
            res.status(200).json({categories});
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }

    async addCategory(req, res){
        const {name} = req.body;

        try{
            await this.categoryRepository.create({name});

            res.status(201).json({detail: 'Category created successfully.'});
        }catch (error){
            console.log(error.message);
            return res.status(500).json({detail: "Internal server error."});
        }
    }
}

module.exports = CategoryController;