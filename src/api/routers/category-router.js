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
    /**
     #swagger.tags = ['Category']
     #swagger.description = 'Retrieve categories with item count.'

     #swagger.parameters['query'] = {
     in: 'query',
     description: 'A search query to filter categories by name or description.',
     required: false,
     schema: {
     type: 'string'
     }
     }

     #swagger.parameters['status'] = {
     in: 'query',
     description: 'The status of the items to filter by.',
     required: false,
     schema: {
     type: 'string',
     enum: ['approved', 'waiting', 'rejected'],
     default: 'approved'
     }
     }

     #swagger.parameters['dateFrom'] = {
     in: 'query',
     description: 'The start date to filter items.',
     required: false,
     schema: {
     type: 'string',
     format: 'date'
     }
     }

     #swagger.parameters['dateTo'] = {
     in: 'query',
     description: 'The end date to filter items.',
     required: false,
     schema: {
     type: 'string',
     format: 'date'
     }
     }

     #swagger.responses[200] = {
     description: 'A list of categories with item counts.',
     schema: {
     categories: [
     {
     id: 'string',
     name: 'string',
     count: 0
     }
     ]
     }
     }

     #swagger.responses[401] = {
     description: 'Unauthorized access.',
     schema: {
     detail: 'Unauthorized.'
     }
     }

     #swagger.responses[403] = {
     description: 'Access denied if the user is not an admin and tries to access non-approved items.',
     schema: {
     detail: 'Access denied.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal server error.'
     }
     }
     */
    (req, res) => categoryController.getCategories(req, res)
);

router.post(
    '/add',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.isAdmin(req, res, next),
    /**
     #swagger.tags = ['Category']
     #swagger.description = 'Add a new category.'

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'Data for creating a new category.',
     required: true,
     schema: {
     $name: 'Electronics'
     }
     }

     #swagger.responses[201] = {
     description: 'Category created successfully.',
     schema: {
     detail: 'Category created successfully.'
     }
     }

     #swagger.responses[400] = {
     description: 'Validation error or missing required fields.',
     schema: {
     detail: 'Name is required.'
     }
     }

     #swagger.responses[401] = {
     description: 'Unauthorized access.',
     schema: {
     detail: 'Unauthorized.'
     }
     }

     #swagger.responses[403] = {
     description: 'Access denied if the user is not an admin.',
     schema: {
     detail: 'Access denied.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal server error.'
     }
     }
     */
    (req, res) => categoryController.addCategory(req, res)
);

router.delete(
    '/delete/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.isAdmin(req, res, next),
    /**
     #swagger.tags = ['Category']
     #swagger.description = 'Delete a category by ID.'

     #swagger.parameters['id'] = {
     in: 'path',
     description: 'The unique identifier of the category to be deleted.',
     required: true,
     schema: {
     type: 'string'
     }
     }

     #swagger.responses[204] = {
     description: 'Category deleted successfully.',
     schema: {
     detail: 'Category deleted successfully.'
     }
     }

     #swagger.responses[400] = {
     description: 'Invalid category ID.',
     schema: {
     detail: 'Incorrect category ID.'
     }
     }

     #swagger.responses[401] = {
     description: 'Unauthorized access.',
     schema: {
     detail: 'Unauthorized.'
     }
     }

     #swagger.responses[403] = {
     description: 'Access denied if the user is not an admin.',
     schema: {
     detail: 'Access denied.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal server error.'
     }
     }
     */
    (req, res) => categoryController.deleteCategory(req, res)
);

router.put(
    '/update/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.isAdmin(req, res, next),
    /**
     #swagger.tags = ['Category']
     #swagger.description = 'Update a category by ID.'

     #swagger.parameters['id'] = {
     in: 'path',
     description: 'The unique identifier of the category to be updated.',
     required: true,
     schema: {
     type: 'string'
     }
     }

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'Data for updating the category.',
     required: true,
     schema: {
     $name: 'Updated Category Name'
     }
     }

     #swagger.responses[204] = {
     description: 'Category updated successfully.',
     schema: {
     detail: 'Category updated successfully.'
     }
     }

     #swagger.responses[400] = {
     description: 'Validation error or missing required fields.',
     schema: {
     detail: 'Incorrect category ID.'
     }
     }

     #swagger.responses[401] = {
     description: 'Unauthorized access.',
     schema: {
     detail: 'Unauthorized.'
     }
     }

     #swagger.responses[403] = {
     description: 'Access denied if the user is not an admin.',
     schema: {
     detail: 'Access denied.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal server error.'
     }
     }
     */
    (req, res) => categoryController.updateCategory(req, res)
);

module.exports = router;