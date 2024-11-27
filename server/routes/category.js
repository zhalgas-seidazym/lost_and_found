const express = require('express')
const router = express.Router()

const { createCategories, getCategories } = require('../controllers/categoryController')

createCategories()

router.get('/api/categories', getCategories)

module.exports = router