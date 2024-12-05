const express = require('express')
const router = express.Router()
const passport = require('passport')

const {getUserInfo, changePassword, changeTelegram, changePhone, changeCredentials} = require('../controllers/profileController')
const { validateChangePassword, validateChangeTelegram, validateChangePhone } = require('../middlewares/profileMiddleware')

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get the user's profile and their lost and found items.
 *     description: This endpoint allows authenticated users to retrieve their profile information (email, telegram, phone), along with the list of their lost and found items.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's profile and related lost and found items were successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                 name:
 *                   type: string
 *                   description: The name of the user.
 *                 surname:
 *                   type: string
 *                   description: The surname of the user.
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *                 telegram:
 *                   type: string
 *                   description: The Telegram handle of the user.
 *                 phone:
 *                   type: string
 *                   description: The phone number of the user.
 *                 lostItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the lost item.
 *                       name:
 *                         type: string
 *                         description: The name of the lost item.
 *                       description:
 *                         type: string
 *                         description: The description of the lost item.
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: The images of the lost item.
 *                       userId:
 *                         type: string
 *                         description: The user ID who posted the lost item.
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The category ID of the lost item.
 *                           name:
 *                             type: string
 *                             description: The category name of the lost item.
 *                       lostDate:
 *                         type: string
 *                         format: date
 *                         description: The date when the item was lost.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date when the lost item was created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date when the lost item was last updated.
 *                 findItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the found item.
 *                       name:
 *                         type: string
 *                         description: The name of the found item.
 *                       description:
 *                         type: string
 *                         description: The description of the found item.
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: The images of the found item.
 *                       userId:
 *                         type: string
 *                         description: The user ID who posted the found item.
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The category ID of the found item.
 *                           name:
 *                             type: string
 *                             description: The category name of the found item.
 *                       foundDate:
 *                         type: string
 *                         format: date
 *                         description: The date when the item was found.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date when the found item was created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date when the found item was last updated.
 *             example:
 *               id: "user123"
 *               name: "John"
 *               surname: "Doe"
 *               email: "user@example.com"
 *               telegram: "user_telegram"
 *               phone: "+1234567890"
 *               lostItems:
 *                 - id: "lostItem1"
 *                   name: "Lost Wallet"
 *                   description: "A black wallet with some cards and cash."
 *                   images:
 *                     - "img/lost/wallet1.jpg"
 *                   userId: "user123"
 *                   category:
 *                     id: "category1"
 *                     name: "Accessories"
 *                   lostDate: "2024-11-20"
 *                   createdAt: "2024-11-21T14:00:00Z"
 *                   updatedAt: "2024-11-21T15:00:00Z"
 *               findItems:
 *                 - id: "foundItem1"
 *                   name: "Found Phone"
 *                   description: "A silver phone found in the park."
 *                   images:
 *                     - "img/found/phone1.jpg"
 *                   userId: "user123"
 *                   category:
 *                     id: "category2"
 *                     name: "Electronics"
 *                   foundDate: "2024-11-22"
 *                   createdAt: "2024-11-23T10:00:00Z"
 *                   updatedAt: "2024-11-23T11:00:00Z"
 *       401:
 *         description: Unauthorized access. The user must be authenticated with a valid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Unexpected error occurred while retrieving the user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.get(
    '/api/profile', 
    passport.authenticate('jwt', {session: false}),
    getUserInfo
)

/**
 * @swagger
 * /api/profile/changepassword:
 *   put:
 *     summary: Change the user's password.
 *     description: This endpoint allows the user to change their password by providing the current password and the new password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the user.
 *               newPassword:
 *                 type: string
 *                 description: The new password that the user wants to set.
 *             required:
 *               - currentPassword
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
 *                   example: "Passwords changed successfully."
 *       400:
 *         description: Bad request due to invalid current password or other issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unmatching passwords."
 *       401:
 *         description: Unauthorized access. The user must be authenticated with a valid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Unexpected error occurred while changing the password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.put(
    '/api/profile/changepassword',
    passport.authenticate('jwt', {session: false}),
    validateChangePassword,
    changePassword
)

/**
 * @swagger
 * /api/profile/changetelegram:
 *   put:
 *     summary: Change the user's Telegram nickname.
 *     description: This endpoint allows the user to update their Telegram nickname.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telegram:
 *                 type: string
 *                 description: The new Telegram username or nickname that the user wants to set.
 *             required:
 *               - telegram
 *     responses:
 *       200:
 *         description: The Telegram nickname was successfully changed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Telegram nickname changed successfully."
 *       400:
 *         description: Bad request due to invalid input or missing Telegram data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Telegram username."
 *       401:
 *         description: Unauthorized access. The user must be authenticated with a valid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Unexpected error occurred while changing the Telegram nickname.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.put(
    '/api/profile/changetelegram',
    passport.authenticate('jwt', {session: false}),
    validateChangeTelegram,
    changeTelegram
)

/**
 * @swagger
 * /api/profile/changephone:
 *   put:
 *     summary: Change the user's phone number.
 *     description: This endpoint allows the user to update their phone number.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The new phone number that the user wants to set.
 *             required:
 *               - phone
 *     responses:
 *       200:
 *         description: The phone number was successfully changed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Phone number changed successfully."
 *       400:
 *         description: Bad request due to invalid input or missing phone data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid phone number."
 *       401:
 *         description: Unauthorized access. The user must be authenticated with a valid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Unexpected error occurred while changing the phone number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.put(
    '/api/profile/changephone',
    passport.authenticate('jwt', {session: false}),
    validateChangePhone,
    changePhone
)

/**
 * @swagger
 * /api/profile/changecredentials:
 *   put:
 *     summary: Update the user's name and surname.
 *     description: This endpoint allows an authenticated user to change their name and surname. The request must include the user's new name and/or surname in the body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new first name of the user.
 *               surname:
 *                 type: string
 *                 description: The new surname of the user.
 *             required:
 *     responses:
 *       200:
 *         description: User credentials updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User credentials changed successfully."
 *       400:
 *         description: Bad request (e.g., missing or invalid fields).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input."
 *       401:
 *         description: Unauthorized (authentication required).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized. Please log in."
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
router.put('/api/profile/changecredentials', passport.authenticate('jwt', {session: false}), changeCredentials)

module.exports = router