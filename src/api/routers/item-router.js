const express = require('express');
const router = express.Router();

const {GCSService} = require('../../services/global-services');
const {ItemController} = require('../controllers/global-controllers');
const {ItemRepository, UserRepository, RoleRepository, CategoryRepository} = require('../../repositories/global-repositories');
const Middleware = require('../middlewares/middleware');


const gcsService = new GCSService();
const itemRepository = new ItemRepository();
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();
const roleRepository = new RoleRepository();

const itemController = new ItemController(itemRepository, categoryRepository, gcsService);
const middleware = new Middleware(userRepository, roleRepository, itemRepository);

router.post(
    '/create',
    (req, res, next) => middleware.isAuth(req, res, next),
    gcsService.upload.array('images', 5),
    async (req, res, next) => await gcsService.uploadToGCS(req, res, next),
    middleware.validateCreateItem,
    (req, res) => itemController.createItem(req, res)
);

router.delete(
    '/update/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.validateId(req, res, next),
    (req, res, next) => middleware.checkAccessToItem(req, res, next),
    (req, res) => itemController.deleteImage(req, res)
);

router.put(
    '/update/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.validateId(req, res, next),
    (req, res, next) => middleware.checkAccessToItem(req, res, next),
    gcsService.upload.array('images', 5),
    (req, res, next) => gcsService.uploadToGCS(req, res, next),
    (req, res) => itemController.updateItem(req, res)
);

router.delete(
    '/delete/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.validateId(req, res, next),
    (req, res, next) => middleware.checkAccessToItem(req, res, next),
    (req, res) => itemController.deleteItem(req, res)
);

router.put(
    '/update/status/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.isAdmin(req, res, next),
    (req, res, next) => middleware.validateId(req, res, next),
    (req, res, next) => middleware.checkAccessToItem(req, res, next),
    (req, res) => itemController.updateItemStatus(req, res)
);

module.exports = router;