const express = require('express')
const router = express.Router()
const passport = require('passport')

const upload = require('../utils/multer')
const { validateFoundAdd } = require('../middlewares/foundMiddleware')
const { foundItemAdd, foundItemUpdate, foundItemDelete, foundItemSearch, foundItemGetById } = require('../controllers/foundController')

router.post(
    '/api/found/add', 
    passport.authenticate('jwt', {session: false}),
    upload.array('foundItemImages', 10),
    validateFoundAdd,
    foundItemAdd
)

router.put('/api/found/update/', (req, res) => {
    res.status(400).json({ error: "Update post id is required." })
})

router.put(
    '/api/found/update/:id', 
    passport.authenticate('jwt', {session: false}),
    upload.array('foundItemImages', 10),
    foundItemUpdate
)

router.delete('/api/found/delete/', (req, res) => {
    res.status(400).json({ error: "Delete post id is required." })
})

router.delete(
    '/api/found/delete/:id', 
    passport.authenticate('jwt', {session: false}),
    foundItemDelete
)

router.get('/api/found', foundItemSearch)

router.get('/api/found/:id', foundItemGetById)


module.exports = router