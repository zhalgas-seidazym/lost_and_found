const express = require('express');
const router = express.Router();

const {CategoryRepository, ItemRepository, UserRepository, RoleRepository} = require('../../repositories/global-repositories');
const {CategoryController} = require('../controllers/global-controllers');
const Middleware = require('../middlewares/middleware');

const categoryRepository = new CategoryRepository();
const itemRepository = new ItemRepository();
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

const categoryController = new CategoryController(categoryRepository, itemRepository, roleRepository);
const middleware = new Middleware(userRepository, roleRepository, itemRepository);


router.get(
    '/',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res) => categoryController.getCategories(req, res)
);

router.post(
    '/add',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.isAdmin(req, res, next),
    (req, res) => categoryController.addCategory(req, res)
);

router.delete(
    '/delete/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.isAdmin(req, res, next),
    (req, res) => categoryController.deleteCategory(req, res)
);


module.exports = router;