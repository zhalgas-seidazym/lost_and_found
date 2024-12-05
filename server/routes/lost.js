const express = require('express')
const router = express.Router()
const passport = require('passport')

const upload = require('../utils/multer')
const { validateLostAdd } = require('../middlewares/lostMiddleware')
const { lostItemAdd, lostItemUpdate, lostItemDelete, lostItemSearch, lostItemGetById } = require('../controllers/lostController')

/**
 * @swagger
 * /api/lost/add:
 *   post:
 *     summary: Add a new lost item to the database.
 *     description: This endpoint allows the user to add a new lost item with its details, including name, description, category, and images.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the lost item.
 *               description:
 *                 type: string
 *                 description: A description of the lost item (optional).
 *               categoryId:
 *                 type: string
 *                 description: The category ID to which the lost item belongs.
 *               lostDate:
 *                 type: string
 *                 format: date
 *                 description: The date the item was lost (optional).
 *               lostItemImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The images of the lost item (up to 10 files).
 *             required:
 *               - name
 *               - categoryId
 *               - lostDate
 *     responses:
 *       200:
 *         description: The lost item was successfully added to the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the lost item.
 *                 name:
 *                   type: string
 *                   description: The name of the lost item.
 *                 description:
 *                   type: string
 *                   description: The description of the lost item.
 *                 userId:
 *                   type: string
 *                   description: The user ID who added the lost item.
 *                 categoryId:
 *                   type: string
 *                   description: The category ID of the lost item.
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The URLs or paths to images of the lost item.
 *                 lostDate:
 *                   type: string
 *                   format: date
 *                   description: The date the item was lost.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the lost item was created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the lost item was last updated.
 *             example:
 *               id: "67890xyz"
 *               name: "Wallet"
 *               description: "A brown leather wallet."
 *               userId: "user456"
 *               categoryId: "Accessories"
 *               images:
 *                 - "img/lost/wallet1.jpg"
 *                 - "img/lost/wallet2.jpg"
 *               lostDate: "2024-11-28"
 *               createdAt: "2024-11-29T14:25:00Z"
 *               updatedAt: "2024-11-29T14:30:00Z"
 *       400:
 *         description: Missing required fields or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields."
 *       500:
 *         description: Unexpected error occurred while adding the lost item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post(
    '/api/lost/add', 
    passport.authenticate('jwt', {session: false}),
    upload.array('lostItemImages', 10),
    validateLostAdd,
    lostItemAdd
)

/**
 * @swagger
 * /api/lost/update/:
 *   put:
 *     summary: Update a lost item.
 *     description: This endpoint updates the details of an existing lost item.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Update post id is required."
 *     responses:
 *       400:
 *         description: Update post id is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Update post id is required."
 *       500:
 *         description: Unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.put('/api/lost/update/', (req, res) => {
    try{
        res.status(400).json({ error: "Update post id is required." })
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
})

/**
 * @swagger
 * /api/lost/update/{id}:
 *   put:
 *     summary: Update an existing lost item.
 *     description: This endpoint allows the user to update the details of a lost item, including its name, description, category, images, and updates the `updatedAt` field to reflect the modification timestamp.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the lost item to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the lost item.
 *               description:
 *                 type: string
 *                 description: A description of the lost item (optional).
 *               categoryId:
 *                 type: string
 *                 description: The category ID to which the lost item belongs.
 *               lostDate:
 *                 type: string
 *                 format: date
 *                 description: The date the item was lost (optional).
 *               lostItemImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The images of the lost item (up to 10 files). Users can select files from their devices.
 *     responses:
 *       200:
 *         description: The lost item was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the lost item.
 *                 name:
 *                   type: string
 *                   description: The updated name of the lost item.
 *                 description:
 *                   type: string
 *                   description: The updated description of the lost item.
 *                 categoryId:
 *                   type: string
 *                   description: The updated category ID of the lost item.
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The updated URLs or paths to images of the lost item.
 *                 lostDate:
 *                   type: string
 *                   format: date
 *                   description: The date the item was lost.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the lost item was originally created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the lost item was last updated (current time).
 *                 userId:
 *                   type: string
 *                   description: The user ID who updated the lost item.
 *             example:
 *               id: "12345abc"
 *               name: "Wallet"
 *               description: "Black leather wallet found."
 *               categoryId: "Personal Items"
 *               images:
 *                 - "img/lost/wallet1.jpg"
 *                 - "img/lost/wallet2.jpg"
 *               lostDate: "2024-11-28"
 *               createdAt: "2024-11-28T14:00:00Z"
 *               updatedAt: "2024-11-29T14:30:00Z"
 *               userId: "user123"
 *       400:
 *         description: Access denied or invalid lost item ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied."
 *       404:
 *         description: Lost item with the provided ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lost item post with this id does not exist."
 *       500:
 *         description: Unexpected error occurred while updating the lost item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.put(
    '/api/lost/update/:id', 
    passport.authenticate('jwt', {session: false}),
    upload.array('lostItemImages', 10),
    lostItemUpdate
)

/**
 * @swagger
 * /api/lost/delete:
 *   delete:
 *     summary: Delete a lost item post.
 *     description: This endpoint allows the user to delete a lost item post.
 *     responses:
 *       400:
 *         description: Delete post ID is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Delete post id is required."
 *       500:
 *         description: Unexpected error occurred while deleting the lost item post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.delete('/api/lost/delete/', (req, res) => {
    try{
        res.status(400).json({ error: "Delete post id is required." })
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
})

/**
 * @swagger
 * /api/lost/delete/{id}:
 *   delete:
 *     summary: Delete a lost item post.
 *     description: This endpoint allows the user to delete a lost item post by its ID. Authentication is required, and only the user who created the post can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the lost item post to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lost item post successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lost item post deleted successfully."
 *       400:
 *         description: The lost item post with this ID does not exist or access is denied.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied." 
 *       500:
 *         description: Unexpected error occurred while deleting the lost item post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.delete(
    '/api/lost/delete/:id', 
    passport.authenticate('jwt', {session: false}),
    lostItemDelete
)

/**
 * @swagger
 * /api/lost:
 *   get:
 *     summary: Search for lost items.
 *     description: This endpoint allows users to search for lost items by query (name or description), category, date range, and sort order, with pagination support.
 *     parameters:
 *       - name: query
 *         in: query
 *         description: A search query to filter items by name or description.
 *         required: false
 *         schema:
 *           type: string
 *       - name: categoryId
 *         in: query
 *         description: The category ID to filter the lost items by.
 *         required: false
 *         schema:
 *           type: string
 *       - name: dateFrom
 *         in: query
 *         description: The start date for filtering items by the lost date (ISO 8601 format).
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: dateTo
 *         in: query
 *         description: The end date for filtering items by the lost date (ISO 8601 format).
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: sort
 *         in: query
 *         description: The sort order for the results, either "asc" for ascending or "desc" for descending based on the lost date.
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "desc" 
 *       - name: page
 *         in: query
 *         description: The page number for pagination (defaults to 0).
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: A list of lost items matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: The total number of lost items matching the filter.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages based on pagination.
 *                 page:
 *                   type: integer
 *                   description: The current page number.
 *                 lostItems: 
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the lost item.
 *                       name:
 *                         type: string
 *                         description: The name of the lost item.
 *                       description:
 *                         type: string
 *                         description: A description of the lost item.
 *                       userId:
 *                         type: string
 *                         description: The ID of the user who created the lost item post.
 *                       category: 
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The ID of the category the lost item belongs to.
 *                           name:
 *                             type: string
 *                             description: The name of the category the lost item belongs to.
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: The URLs or paths to images of the lost item.
 *                       lostDate: 
 *                         type: string
 *                         format: date-time
 *                         description: The date when the item was lost.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the lost item was originally created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the lost item was last updated.
 *             example:
 *               totalItems: 50
 *               totalPages: 3
 *               page: 1
 *               lostItems: 
 *                 - id: "12345abc"
 *                   name: "Lost Wallet"
 *                   description: "A black wallet found near the park."
 *                   userId: "user123"
 *                   category:
 *                     id: "electronics"
 *                     name: "Electronics" 
 *                   images:
 *                     - "img/lost/wallet1.jpg"
 *                     - "img/lost/wallet2.jpg"
 *                   lostDate: "2024-11-25T12:00:00Z"
 *                   createdAt: "2024-11-28T14:00:00Z"
 *                   updatedAt: "2024-11-29T14:30:00Z"
 *       500:
 *         description: Unexpected error occurred while fetching lost items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.get('/api/lost', lostItemSearch)

/**
 * @swagger
 * /api/lost/{id}:
 *   get:
 *     summary: Get details of a specific lost item by ID.
 *     description: This endpoint allows users to retrieve detailed information about a lost item, including its name, description, images, user details, and category.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the lost item to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The lost item details were successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the lost item.
 *                 name:
 *                   type: string
 *                   description: The name of the lost item.
 *                 description:
 *                   type: string
 *                   description: A description of the lost item.
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The URLs or paths to images of the lost item.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the user who posted the lost item.
 *                     name:
 *                       type: string
 *                       description: The name of the user who posted the lost item.
 *                     surname:
 *                       type: string
 *                       description: The surname of the user who posted the lost item.
 *                     email:
 *                       type: string
 *                       description: The email of the user who posted the lost item.
 *                     telegram:
 *                       type: string
 *                       description: The Telegram handle of the user who posted the lost item.
 *                     phone:
 *                       type: string
 *                       description: The phone number of the user who posted the lost item.
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the category of the lost item.
 *                     name:
 *                       type: string
 *                       description: The name of the category of the lost item.
 *                 lostDate:
 *                   type: string
 *                   format: date-time
 *                   description: The date when the item was lost.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the lost item was originally created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the lost item was last updated.
 *             example:
 *               id: "12345abc"
 *               name: "Lost Wallet"
 *               description: "A black wallet with some cards and cash."
 *               images:
 *                 - "img/lost/wallet1.jpg"
 *                 - "img/lost/wallet2.jpg"
 *               user:
 *                 id: "user123"
 *                 name: "Zhoma"
 *                 surname: "Turtan"
 *                 email: "user@example.com"
 *                 telegram: "user_telegram"
 *                 phone: "+1234567890"
 *               category:
 *                 id: "electronics"
 *                 name: "Electronics"
 *               lostDate: "2024-11-25T12:30:00Z"
 *               createdAt: "2024-11-28T14:00:00Z"
 *               updatedAt: "2024-11-29T14:30:00Z"
 *       404:
 *         description: Lost item with the given ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lost item post with this id does not exist."
 *       500:
 *         description: Unexpected error occurred while retrieving the lost item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.get('/api/lost/:id', lostItemGetById)


module.exports = router