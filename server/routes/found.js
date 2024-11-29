const express = require('express')
const router = express.Router()
const passport = require('passport')

const upload = require('../utils/multer')
const { validateFoundAdd } = require('../middlewares/foundMiddleware')
const { foundItemAdd, foundItemUpdate, foundItemDelete, foundItemSearch, foundItemGetById } = require('../controllers/foundController')

/**
 * @swagger
 * /api/found/add:
 *   post:
 *     summary: Add a new found item to the database.
 *     description: This endpoint allows the user to add a new found item with its details including name, description, category, and images.
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
 *                 description: The name of the found item.
 *               description:
 *                 type: string
 *                 description: A description of the found item (optional).
 *               category:
 *                 type: string
 *                 description: The category ID to which the found item belongs.
 *               foundItemImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The images of the found item (up to 10 files). Users can select files from their devices.
 *             required:
 *               - name
 *               - category
 *     responses:
 *       200:
 *         description: The found item was successfully added to the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the found item.
 *                 name:
 *                   type: string
 *                   description: The name of the found item.
 *                 user:
 *                   type: string
 *                   description: The user ID who added the found item.
 *                 category:
 *                   type: string
 *                   description: The category ID of the found item.
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The URLs or paths to images of the found item.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the found item was created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the found item was last updated.
 *             example:
 *               id: "12345abc"
 *               name: "Laptop"
 *               user: "user123"
 *               category: "Electronics"
 *               images:
 *                 - "img/found/laptop1.jpg"
 *                 - "img/found/laptop2.jpg"
 *               createdAt: "2024-11-29T14:25:00Z"
 *               updatedAt: "2024-11-29T14:25:00Z"
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
 *         description: Unexpected error occurred while adding the found item.
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
    '/api/found/add', 
    passport.authenticate('jwt', {session: false}),
    upload.array('foundItemImages', 10),
    validateFoundAdd,
    foundItemAdd
)

/**
 * @swagger
 * /api/found/update:
 *   put:
 *     summary: Attempt to update a found item.
 *     description: This endpoint requires an item ID to update the found item. If the ID is missing, a 400 error is returned.
 *     responses:
 *       400:
 *         description: The item ID is required for the update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Update post id is required."
 *       500:
 *         description: An unexpected error occurred during the update process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.put('/api/found/update/', (req, res) => {
    try{
        res.status(400).json({ error: "Update post id is required." })
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
})

/**
 * @swagger
 * /api/found/update/{id}:
 *   put:
 *     summary: Update an existing found item.
 *     description: This endpoint allows users to update a found item with new details such as name, description, category, and images. The item can be updated only by the user who created it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the found item to update.
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
 *                 description: The updated name of the found item (optional).
 *               description:
 *                 type: string
 *                 description: The updated description of the found item (optional).
 *               category:
 *                 type: string
 *                 description: The updated category ID of the found item (optional).
 *               foundItemImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New images for the found item (up to 10 files). Users can select files from their devices.
 *             required:
 *               - name
 *               - category
 *     responses:
 *       200:
 *         description: The found item was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the updated found item.
 *                 name:
 *                   type: string
 *                   description: The updated name of the found item.
 *                 description:
 *                   type: string
 *                   description: The updated description of the found item.
 *                 category:
 *                   type: string
 *                   description: The updated category ID of the found item.
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The updated URLs or paths to images of the found item.
 *             example:
 *               id: "12345abc"
 *               name: "Updated Laptop"
 *               description: "A laptop with scratches."
 *               category: "Electronics"
 *               images:
 *                 - "img/found/laptop1_updated.jpg"
 *                 - "img/found/laptop2_updated.jpg"
 *       400:
 *         description: Missing required fields or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found item post with this id does not exist or access denied."
 *       500:
 *         description: Unexpected error occurred while updating the found item.
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
    '/api/found/update/:id', 
    passport.authenticate('jwt', {session: false}),
    upload.array('foundItemImages', 10),
    foundItemUpdate
)

/**
 * @swagger
 * /api/found/delete:
 *   delete:
 *     summary: Delete a found item.
 *     description: This endpoint returns a `400` error if the post ID is not provided in the request body.
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
 *         description: An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.delete('/api/found/delete/', (req, res) => {
    try{
        res.status(400).json({ error: "Delete post id is required." })
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'An unexpected error occurred.' })
    }
})

/**
 * @swagger
 * /api/found/delete/{id}:
 *   delete:
 *     summary: Delete a found item.
 *     description: This endpoint allows the user to delete a found item they have created. Only the user who created the found item can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the found item to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The found item was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found item post deleted successfully."
 *       400:
 *         description: Invalid request, such as access denied or the found item not existing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied."  # Example fixed with valid string
 *       500:
 *         description: Unexpected error occurred while deleting the found item.
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
    '/api/found/delete/:id', 
    passport.authenticate('jwt', {session: false}),
    foundItemDelete
)

/**
 * @swagger
 * /api/found:
 *   get:
 *     summary: Search for found items with optional filtering and pagination.
 *     description: This endpoint allows users to search for found items based on a query (name or description), category, and pagination (page number).
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
 *         description: The search term to filter found items by name or description.
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         required: false
 *         description: The category ID to filter found items.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number for pagination. Defaults to 0 if not provided.
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: A list of found items that match the search query and category, along with pagination details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: The total number of found items matching the filters.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages for pagination.
 *                 page:
 *                   type: integer
 *                   description: The current page number.
 *                 foundItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the found item.
 *                       name:
 *                         type: string
 *                         description: The name of the found item.
 *                       description:
 *                         type: string
 *                         description: A description of the found item.
 *                       user:
 *                         type: string
 *                         description: The user ID who reported the found item.
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The category ID of the found item.
 *                           name:
 *                             type: string
 *                             description: The name of the category.
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: The URLs or paths to images of the found item.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the found item was created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the found item was last updated.
 *             example:
 *               totalItems: 50
 *               totalPages: 3
 *               page: 1
 *               foundItems:
 *                 - id: "607c35f8f01a2c001f9f392b"
 *                   name: "Found Wallet"
 *                   description: "A brown leather wallet found near the park."
 *                   user: "607c35f8f01a2c001f9f392a"
 *                   category:
 *                     id: "607c35f8f01a2c001f9f392c"
 *                     name: "Documents"
 *                   images:
 *                     - "img/found/wallet1.jpg"
 *                     - "img/found/wallet2.jpg"
 *                   createdAt: "2024-11-29T14:25:00Z"
 *                   updatedAt: "2024-11-30T10:10:00Z"
 *                 - id: "607c35f8f01a2c001f9f392d"
 *                   name: "Lost Phone"
 *                   description: "A black smartphone found on the street."
 *                   user: "607c35f8f01a2c001f9f392e"
 *                   category:
 *                     id: "607c35f8f01a2c001f9f392f"
 *                     name: "Electronics"
 *                   images:
 *                     - "img/found/phone1.jpg"
 *                   createdAt: "2024-11-28T10:30:00Z"
 *                   updatedAt: "2024-11-29T12:15:00Z"
 *       500:
 *         description: Unexpected error occurred while searching for found items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.get('/api/found', foundItemSearch)

/**
 * @swagger
 * /api/found/{id}:
 *   get:
 *     summary: Get details of a specific found item by ID.
 *     description: This endpoint allows the user to retrieve detailed information about a found item, including its name, description, images, user details, and category.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the found item to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the found item details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the found item.
 *                 name:
 *                   type: string
 *                   description: The name of the found item.
 *                 description:
 *                   type: string
 *                   description: A description of the found item.
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The URLs or paths to images of the found item.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the user who reported the found item.
 *                     email:
 *                       type: string
 *                       description: The email address of the user who reported the found item.
 *                     telegram:
 *                       type: string
 *                       description: The Telegram handle of the user who reported the found item.
 *                     phone:
 *                       type: string
 *                       description: The phone number of the user who reported the found item.
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the category the found item belongs to.
 *                     name:
 *                       type: string
 *                       description: The name of the category the found item belongs to.
 *             example:
 *               id: "607c35f8f01a2c001f9f392b"
 *               name: "Found Wallet"
 *               description: "A brown leather wallet found near the park."
 *               images:
 *                 - "img/found/wallet1.jpg"
 *                 - "img/found/wallet2.jpg"
 *               user:
 *                 id: "607c35f8f01a2c001f9f392a"
 *                 email: "user@example.com"
 *                 telegram: "@user_telegram"
 *                 phone: "+1234567890"
 *               category:
 *                 id: "607c35f8f01a2c001f9f392c"
 *                 name: "Documents"
 *       404:
 *         description: The found item with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found item post with this id does not exist."
 *       500:
 *         description: Unexpected error occurred while retrieving the found item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.get('/api/found/:id', foundItemGetById)


module.exports = router