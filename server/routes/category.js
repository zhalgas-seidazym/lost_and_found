const express = require('express')
const router = express.Router()

const { createCategories, getCategories } = require('../controllers/categoryController')

createCategories()

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of categories with counts of lost and found items.
 *     description: This endpoint retrieves all categories and the number of lost and found items associated with each category.
 *     responses:
 *       200:
 *         description: A list of categories with item counts successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the category.
 *                   name:
 *                     type: string
 *                     description: The name of the category.
 *                   lostItemsCount:
 *                     type: integer
 *                     description: The number of lost items in this category.
 *                   foundItemsCount:
 *                     type: integer
 *                     description: The number of found items in this category.
 *             example:
 *               - id: "123abc"
 *                 name: "Electronics"
 *                 lostItemsCount: 10
 *                 foundItemsCount: 5
 *               - id: "456def"
 *                 name: "Clothing"
 *                 lostItemsCount: 2
 *                 foundItemsCount: 7
 *       500:
 *         description: Unexpected error occurred while retrieving categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.get('/api/categories', getCategories)

module.exports = router