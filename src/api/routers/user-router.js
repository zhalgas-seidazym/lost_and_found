const express = require('express');
const router = express.Router();

const {UserRepository, RoleRepository} = require('../../repositories/global-repositories');
const {UserController} = require('../controllers/global-controllers');
const {EmailService, RedisService} = require('../../services/global-services');
const Middleware = require("../middlewares/middleware");

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const emailService = new EmailService();
const redisService = new RedisService();
const middleware = new Middleware(userRepository, roleRepository);
const userController = new UserController(userRepository, roleRepository, redisService, emailService);

router.post(
    '/auth/sign-up',
    middleware.validateSignUp,
    /**
     #swagger.tags = ['Auth']
     #swagger.description = 'Sign up a new user.'

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'User registration data.',
     required: true,
     schema: {
     $name: 'John',
     $surname: 'Doe',
     $email: 'john.doe@example.com',
     $password: 'securepassword123'
     }
     }

     #swagger.responses[200] = {
     description: 'User registration initiated.',
     schema: {
     detail: 'Please pass verification to finish creating user.'
     }
     }

     #swagger.responses[400] = {
     description: 'Validation error.',
     schema: {
     detail: {
     name: 'Name is required.',
     surname: 'Surname is required.',
     email: 'Email is required.',
     password: 'Password is required.'
     }
     }
     }

     #swagger.responses[409] = {
     description: 'User with email already exists.',
     schema: {
     detail: 'User with this email already exists.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.signUp(req, res)
);

router.post(
    '/auth/send-verification',
    /**
     #swagger.tags = ['Auth']
     #swagger.description = 'Send verification email for user registration.'

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'Email and redirect URL for verification.',
     required: true,
     schema: {
     $email: 'user@example.com',
     $redirectUrl: 'https://example.com/verify'
     }
     }

     #swagger.responses[200] = {
     description: 'Verification email sent successfully.',
     schema: {
     detail: 'Account verification sent successfully.'
     }
     }

     #swagger.responses[400] = {
     description: 'Invalid email.',
     schema: {
     detail: 'Invalid email.'
     }
     }

     #swagger.responses[409] = {
     description: 'Account already verified.',
     schema: {
     detail: 'Account with this email already verified.'
     }
     }

     #swagger.responses[429] = {
     description: 'Too many requests for verification.',
     schema: {
     detail: 'Please wait X seconds before resending.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.sendVerificationToEmail(req, res)
);
router.post(
    '/auth/check-verification',
    /**
     #swagger.tags = ['Auth']
     #swagger.description = 'Check verification token for user registration.'

     #swagger.parameters['verificationToken'] = {
     in: 'query',
     description: 'The verification token from the email.',
     required: true,
     schema: {
     type: 'string'
     }
     }

     #swagger.responses[201] = {
     description: 'User created successfully.',
     schema: {
     detail: 'User created successfully.'
     }
     }

     #swagger.responses[401] = {
     description: 'Invalid or expired verification token.',
     schema: {
     detail: 'Verification token is invalid or expired.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.checkVerificationToken(req, res)
);

router.post(
    '/auth/sign-in',
    /**
     #swagger.tags = ['Auth']
     #swagger.description = 'Sign in an existing user.'

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'User login data.',
     required: true,
     schema: {
     $email: 'john.doe@example.com',
     $password: 'securepassword123'
     }
     }

     #swagger.responses[200] = {
     description: 'User signed in successfully.',
     schema: {
     accessToken: 'string',
     role: 'string'
     }
     }

     #swagger.responses[401] = {
     description: 'Invalid email or password.',
     schema: {
     detail: 'Invalid email or password.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.signIn(req, res)
);

router.post(
    '/auth/logout',
    /**
     #swagger.tags = ['Auth']
     #swagger.description = 'Log out the current user.'

     #swagger.responses[200] = {
     description: 'User logged out successfully.',
     schema: {
     detail: 'Logged out successfully.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.logout(req, res)
);

router.get(
    '/auth/refresh',
    /**
     #swagger.tags = ['Auth']
     #swagger.description = 'Refresh access token using a refresh token.'

     #swagger.responses[200] = {
     description: 'New access token generated.',
     schema: {
     accessToken: 'string'
     }
     }

     #swagger.responses[401] = {
     description: 'Invalid or expired refresh token.',
     schema: {
     detail: 'Refresh token is invalid or expired.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.refreshToken(req, res)
);

router.post(
    '/password/send-token',
    /**
     #swagger.tags = ['Auth']
     #swagger.description = 'Send a password reset token to the user's email.'

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'Email and redirect URL for password reset.',
     required: true,
     schema: {
     $email: 'user@example.com',
     $redirectUrl: 'https://example.com/reset-password'
     }
     }

     #swagger.responses[200] = {
     description: 'Password reset link sent successfully.',
     schema: {
     detail: 'Password reset link sent successfully.'
     }
     }

     #swagger.responses[404] = {
     description: 'User not found.',
     schema: {
     detail: 'User with this email does not exist.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.sendPasswordResetToken(req, res)
);
router.put(
    '/password/change',
    /**
     #swagger.tags = ['Auth']
     #swagger.description = 'Reset user password using a valid reset token.'

     #swagger.parameters['token'] = {
     in: 'query',
     description: 'The password reset token.',
     required: true,
     schema: {
     type: 'string'
     }
     }

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'New password for the user.',
     required: true,
     schema: {
     $newPassword: 'newSecurePassword123'
     }
     }

     #swagger.responses[200] = {
     description: 'Password reset successfully.',
     schema: {
     detail: 'Password reset successfully.'
     }
     }

     #swagger.responses[400] = {
     description: 'Invalid or missing password.',
     schema: {
     detail: 'New password is invalid.'
     }
     }

     #swagger.responses[401] = {
     description: 'Invalid or expired reset token.',
     schema: {
     detail: 'Reset token is invalid or expired.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.checkPasswordTokenAndResetPassword(req, res)
);

router.get(
    '/profile',
    (req, res, next) => middleware.isAuth(req, res, next),
    /**
     #swagger.tags = ['User']
     #swagger.description = 'Retrieve the current user profile.'

     #swagger.responses[200] = {
     description: 'Current user profile data.',
     schema: {
     name: 'John',
     surname: 'Doe',
     email: 'john.doe@example.com',
     telegram: 'john_doe_telegram',
     phoneNumber: '+123456789'
     }
     }

     #swagger.responses[401] = {
     description: 'Unauthorized access.',
     schema: {
     detail: 'Unauthorized.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.me(req, res)
);

router.put(
    '/profile/update',
    (req, res, next) => middleware.isAuth(req, res, next),
    /**
     #swagger.tags = ['User']
     #swagger.description = 'Update the user profile.'

     #swagger.parameters['body'] = {
     in: 'body',
     description: 'User profile update data.',
     required: true,
     schema: {
     name: 'John',
     surname: 'Doe',
     password: 'currentPassword123',
     newPassword: 'newSecurePassword123',
     telegram: 'john_doe_telegram',
     phoneNumber: '+123456789'
     }
     }

     #swagger.responses[204] = {
     description: 'Profile updated successfully.',
     schema: {
     detail: 'Profile updated successfully.'
     }
     }

     #swagger.responses[400] = {
     description: 'Invalid data or missing fields.',
     schema: {
     detail: 'Password is incorrect.'
     }
     }

     #swagger.responses[404] = {
     description: 'User not found.',
     schema: {
     detail: 'User not found.'
     }
     }

     #swagger.responses[500] = {
     description: 'Internal server error.',
     schema: {
     detail: 'Internal Server Error.'
     }
     }
     */
    (req, res) => userController.updateProfile(req, res)
);

module.exports = router;