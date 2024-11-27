const express = require('express')
const router = express.Router()

const {signUp, sendCode, signIn, forgotPasswordSendCode, forgotPasswordVerifyCode, forgotPasswordChangePassword} = 
    require('../controllers/authorizationConroller')
const {validateSendCode, validateSignUp, validateSignIn, validateForgotPasswordSendCode, validateForgotPasswordVerifyCode, 
    validateForgotPasswordChangePassword} = require('../middlewares/authorizationMiddleware')

router.post('/api/sendcode', validateSendCode, sendCode)

router.post('/api/signup', validateSignUp, signUp)

router.post('/api/signin', validateSignIn, signIn)

router.post('/api/forgotpassword/sendcode', validateForgotPasswordSendCode, forgotPasswordSendCode)

router.post('/api/forgotpassword/verifycode', validateForgotPasswordVerifyCode, forgotPasswordVerifyCode)

router.put('/api/forgotpassword/changepassword', validateForgotPasswordChangePassword, forgotPasswordChangePassword)

module.exports = router