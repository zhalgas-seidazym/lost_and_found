const express = require('express')
const router = express.Router()

const {search} = require('../controllers/searchController')

router.post('/api/search', (req, res, next) => {next()}, search)

module.exports = router