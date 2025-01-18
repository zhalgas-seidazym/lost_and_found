const express = require('express');
const router = express.Router();

const userRouter = require('./user-router')
const itemRouter = require('./item-router')

router.use('/user', userRouter)
router.use('/item', itemRouter)

module.exports = router;