const express = require('express')
const router = express.Router()
const passport = require('passport')

const {getUserInfo, changePassword, changeTelegram, changePhone} = require('../controllers/profileController')
const { validateChangePassword, validateChangeTelegram, validateChangePhone } = require('../middlewares/profileMiddleware')

router.get(
    '/api/profile', 
    passport.authenticate('jwt', {session: false}),
    getUserInfo
)

router.put(
    '/api/changepassword',
    passport.authenticate('jwt', {session: false}),
    validateChangePassword,
    changePassword
)

router.put(
    '/api/changetelegram',
    passport.authenticate('jwt', {session: false}),
    validateChangeTelegram,
    changeTelegram
)

router.put(
    '/api/changephone',
    passport.authenticate('jwt', {session: false}),
    validateChangePhone,
    changePhone
)

module.exports = router