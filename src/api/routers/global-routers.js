const express = require('express');
const router = express.Router();

const userRouter = require('./user-router');
const itemRouter = require('./item-router');
const categoryRouter = require('./category-router');

router.use('/user', userRouter)
router.use('/item', itemRouter)
router.use('/category', categoryRouter)

module.exports = router;