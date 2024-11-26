const express = require('express')
const router = express.Router()

const {signUp, sendCode, signIn} = require('../controllers/authorizationConroller')
const {validateSendCode, validateSignUp, validateSignIn} = require('../middlewares/authorizationMiddleware')

router.post('/api/sendcode', validateSendCode, sendCode)

router.post('/api/signup', validateSignUp, signUp)

router.post('/api/signin', validateSignIn, signIn)

module.exports = router