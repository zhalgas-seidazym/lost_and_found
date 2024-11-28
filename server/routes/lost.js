const express = require('express')
const router = express.Router()
const passport = require('passport')

const upload = require('../utils/multer')
const { validateLostAdd } = require('../middlewares/lostMiddleware')
const { lostItemAdd, lostItemUpdate, lostItemDelete, lostItemSearch, lostItemGetById } = require('../controllers/lostController')

router.post(
    '/api/lost/add', 
    passport.authenticate('jwt', {session: false}),
    upload.array('lostItemImages', 10),
    validateLostAdd,
    lostItemAdd
)

router.put('/api/lost/update/', (req, res) => {
    res.status(400).json({ error: "Update post id is required." })
})

router.put(
    '/api/lost/update/:id', 
    passport.authenticate('jwt', {session: false}),
    upload.array('lostItemImages', 10),
    lostItemUpdate
)

router.delete('/api/lost/delete/', (req, res) => {
    res.status(400).json({ error: "Delete post id is required." })
})

router.delete(
    '/api/lost/delete/:id', 
    passport.authenticate('jwt', {session: false}),
    lostItemDelete
)

router.get('/api/lost', lostItemSearch)

router.get('/api/lost/:id', lostItemGetById)


module.exports = router