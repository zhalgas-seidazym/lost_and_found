const express = require('express')
const router = express.Router()

const {signUp, sendCode, signIn, forgotPasswordSendCode, forgotPasswordVerifyCode, forgotPasswordChangePassword} = 
    require('../controllers/authorizationConroller')
const {validateSendCode, validateSignUp, validateSignIn, validateForgotPasswordSendCode, validateForgotPasswordVerifyCode, 
    validateForgotPasswordChangePassword} = require('../middlewares/authorizationMiddleware')

/**
 * @swagger
 * /api/sendcode:
 *   post:
 *     summary: Send a verification code to the provided email address.
 *     description: This endpoint checks if a user already exists with the given email, and if not, it sends a verification code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user to send the verification code to.
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Verification code sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification sent."
 *       400:
 *         description: User with this email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User with this email already exists."
 *       500:
 *         description: Unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.post('/api/sendcode', validateSendCode, sendCode)

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Create a new user account with email, password, verification code, name, and surname.
 *     description: This endpoint allows users to sign up by providing a verification code, email, password, name, and surname. The verification code is checked for validity and expiration before user creation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *               code:
 *                 type: string
 *                 description: The verification code sent to the user's email.
 *               name:
 *                 type: string
 *                 description: The first name of the user.
 *               surname:
 *                 type: string
 *                 description: The surname of the user.
 *             required:
 *               - email
 *               - password
 *               - code
 *               - name
 *               - surname
 *     responses:
 *       200:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully."
 *       400:
 *         description: Bad request (e.g., user already exists, wrong verification code, or expired verification code).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User with this email already exists."
 *       500:
 *         description: Unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.post('/api/signup', validateSignUp, signUp)

/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: User login with email and password.
 *     description: This endpoint allows users to log in by providing their email and password. A valid email and password will return a JWT token for authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User authenticated successfully, and JWT token is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token used for authentication.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1NiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNjEyMzYxMTYwLCJleHBpcmVzSW4iOiJhdGYyMjMifQ.QeXlQ79gh-2bX9Yo71og"
 *       400:
 *         description: Bad request (e.g., incorrect password or user not found).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect password."
 *       500:
 *         description: Unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.post('/api/signin', validateSignIn, signIn)

/**
 * @swagger
 * /api/forgotpassword/sendcode:
 *   post:
 *     summary: Send a verification code for password reset to the provided email address.
 *     description: This endpoint checks if a user exists with the given email. If the user exists, it sends a verification code for resetting the password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user to send the verification code to.
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Verification code sent successfully to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification sent."
 *       400:
 *         description: User with this email does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User with this email does not exist."
 *       500:
 *         description: Unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.post('/api/forgotpassword/sendcode', validateForgotPasswordSendCode, forgotPasswordSendCode)

/**
 * @swagger
 * /api/forgotpassword/verifycode:
 *   post:
 *     summary: Verify the code sent for password reset.
 *     description: This endpoint checks if the provided verification code is valid and not expired for the given email address. If valid, it confirms the verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting to reset the password.
 *               code:
 *                 type: string
 *                 description: The verification code received by the user for password reset.
 *             required:
 *               - email
 *               - code
 *     responses:
 *       200:
 *         description: Verification code is correct and not expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification done."
 *       400:
 *         description: Invalid or expired verification code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification code is wrong."
 *       500:
 *         description: Unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.post('/api/forgotpassword/verifycode', validateForgotPasswordVerifyCode, forgotPasswordVerifyCode)

/**
 * @swagger
 * /api/forgotpassword/changepassword:
 *   put:
 *     summary: Change the password for the user after successful verification.
 *     description: This endpoint allows the user to change their password after verifying their email and receiving a verification code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user whose password needs to be changed.
 *               newPassword:
 *                 type: string
 *                 description: The new password that the user wants to set.
 *             required:
 *               - email
 *               - newPassword
 *     responses:
 *       200:
 *         description: The password was successfully changed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully."
 *       400:
 *         description: User with this email does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User with this email does not exist."
 *       500:
 *         description: Unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.put('/api/forgotpassword/changepassword', validateForgotPasswordChangePassword, forgotPasswordChangePassword)

module.exports = router