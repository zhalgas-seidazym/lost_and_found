const express = require('express');
const router = express.Router();

const {GCSService, RedisService} = require('../../services/global-services');
const {ItemController} = require('../controllers/global-controllers');
const {ItemRepository, UserRepository, RoleRepository, CategoryRepository} = require('../../repositories/global-repositories');
const Middleware = require('../middlewares/middleware');


const gcsService = new GCSService();
const redisService = new RedisService();
const itemRepository = new ItemRepository();
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();
const roleRepository = new RoleRepository();

const itemController = new ItemController(itemRepository, categoryRepository, roleRepository, gcsService, redisService);
const middleware = new Middleware(userRepository, roleRepository, itemRepository);

router.post(
    '/create',
    (req, res, next) => middleware.isAuth(req, res, next),
    gcsService.upload.array('images', 5),
    (req, res, next) => gcsService.uploadToGCS(req, res, next),
    middleware.validateCreateItem,
    /**
     #swagger.tags = ['Items']
     #swagger.description = 'Create a new item.'

     #swagger.consumes = ['multipart/form-data']

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'Data for creating a new item.',
     required: true,
     schema: {
     $name: 'Item Name',
     $description: 'Item Description',
     $date: '2025-01-01',
     $categoryId: '1234567890abcdef12345678',
     $type: 'lost',
     }
     }

     #swagger.parameters['images'] = {
     in: 'formData',
     type: 'array',
     items: {
     type: 'file',
     format: 'binary'
     },
     description: 'Up to 5 images for the item, provided as file uploads.'
     }

     #swagger.responses[200] = {
     description: 'Item created successfully.',
     schema: {
     detail: 'Item created successfully.',
     itemId: '1234567890abcdef12345678'
     }
     }

     #swagger.responses[400] = {
     description: 'Validation error.',
     schema: {
     name: 'Name is required.',
     categoryId: 'Category ID is required.',
     date: 'Date is required.',
     images: 'Images are required.',
     type: "Type is incorrect. It should be either 'lost' or 'found'.",
     detail: 'Unauthorized.'
     }
     }

     #swagger.responses[401] = {
     description: 'Unauthorized or invalid token.',
     schema: {
     detail: 'Invalid token or unauthorized.'
     }
     }

     #swagger.responses[404] = {
     description: 'Category not found.',
     schema: {
     detail: 'Category not found.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal server error.'
     }
     }
     */
    (req, res) => itemController.createItem(req, res)
);

router.put(
    '/update/status/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.isAdmin(req, res, next),
    (req, res, next) => middleware.checkItemExists(req, res, next),
    (req, res, next) => middleware.checkAccessToItem(req, res, next),
    /**
     #swagger.tags = ['Items']
     #swagger.description = 'Update the status of an item by ID.'

     #swagger.parameters['id'] = {
     in: 'path',
     description: 'The unique identifier of the item to update.',
     required: true,
     schema: {
     type: 'string'
     }
     }

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'The new status for the item. (Valid values: approved, waiting, rejected)',
     required: true,
     schema: {
     $itemStatus: 'approved'
     }
     }

     #swagger.responses[204] = {
     description: 'Item status updated successfully.',
     schema: {
     detail: 'Item approved successfully.'
     }
     }

     #swagger.responses[400] = {
     description: 'Incorrect item status.',
     schema: {
     detail: 'Incorrect item status.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal server error.'
     }
     }
     */
    (req, res) => itemController.updateItemStatus(req, res)
);

router.put(
    '/update/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.checkItemExists(req, res, next),
    (req, res, next) => middleware.checkAccessToItem(req, res, next),
    gcsService.upload.array('images', 5),
    (req, res, next) => gcsService.uploadToGCS(req, res, next),
    /**
     #swagger.tags = ['Items']
     #swagger.description = 'Update an existing item by ID.'

     #swagger.parameters['id'] = {
     in: 'path',
     description: 'The unique identifier of the item to update.',
     required: true,
     schema: {
     type: 'string'
     }
     }

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'Data for updating the item. Images can be added as file uploads, and existing images can be deleted using their URLs.',
     required: true,
     schema: {
     $name: 'Updated Item Name',
     $description: 'Updated Item Description',
     $date: '2025-01-01',
     $categoryId: '1234567890abcdef12345678',
     $type: 'lost',
     deleteImages: ['https://example.com/image1.jpg']
     }
     }

     #swagger.parameters['images'] = {
     in: 'formData',
     type: 'array',
     items: {
     type: 'file',
     format: 'binary'
     },
     description: 'Up to 5 new images for the item, provided as file uploads.'
     }

     #swagger.responses[204] = {
     description: 'Item updated successfully.',
     schema: {
     detail: 'Item updated successfully.'
     }
     }

     #swagger.responses[400] = {
     description: 'Validation error or missing required fields.',
     schema: {
     detail: 'Images are required. You cannot delete all images without adding new ones.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal server error.'
     }
     }
     */
    (req, res) => itemController.updateItem(req, res)
);

router.delete(
    '/delete/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.checkItemExists(req, res, next),
    (req, res, next) => middleware.checkAccessToItem(req, res, next),
    /**
     #swagger.tags = ['Items']
     #swagger.description = 'Delete an item by ID.'

     #swagger.parameters['id'] = {
     in: 'path',
     description: 'The unique identifier of the item to delete.',
     required: true,
     schema: {
     type: 'string'
     }
     }

     #swagger.responses[204] = {
     description: 'Item deleted successfully.',
     schema: {
     detail: 'Item deleted successfully.'
     }
     }

     #swagger.responses[404] = {
     description: 'Item not found.',
     schema: {
     detail: 'Item not found.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal server error.'
     }
     }
     */
    (req, res) => itemController.deleteItem(req, res)
);

router.get(
    '/my',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res) => itemController.getMyItems(req, res)
);

router.get(
    '/search',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res) => itemController.searchItems(req, res)
);

router.get(
    '/:id',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res, next) => middleware.checkItemExists(req, res, next),
    (req, res) => itemController.getItemById(req, res)
);

module.exports = router;