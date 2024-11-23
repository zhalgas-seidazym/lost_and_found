const express = require('express')
const router = express.Router()

const User = require('../models/User')

const {signUp, sendCode} = require('../controllers/authorizationConroller')
const {validateSendCode, validateSignUp} = require('../middlewares/authorizationMiddleware')

router.post('/api/sendcode', validateSendCode, sendCode)

router.post('/api/signup', validateSignUp, signUp)

module.exports = router