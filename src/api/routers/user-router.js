const express = require('express');
const router = express.Router();

const {UserRepository, RoleRepository} = require('../../repositories/global-repositories');
const {UserController} = require('../controllers/global-controllers');
const {EmailService, RedisService} = require('../../services/global-services');
const {UserMiddleware} = require("../middlewares/global-middlewares");

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const emailService = new EmailService();
const redisService = new RedisService();
const userMiddleware = new UserMiddleware(userRepository, roleRepository);
const userController = new UserController(userRepository, roleRepository, redisService, emailService);

router.post('/auth/sign-up', userMiddleware.validateSignUp, (req, res) => userController.signUp(req, res));
router.post('/auth/send-verification', (req, res) => userController.sendVerificationToEmail(req, res));
router.post('/auth/check-verification', (req, res) => userController.checkVerificationToken(req, res));

router.post('/auth/sign-in', (req, res) => userController.signIn(req, res));

router.post('/refresh', (req, res) => userController.refreshToken(req, res));

router.post('/password/send-token', (req, res) => userController.sendPasswordResetToken(req, res));
router.put('/password/change', (req, res) => userController.checkPasswordTokenAndResetPassword(req, res));

router.get(
    '/profile',
    (req, res, next) => userMiddleware.isAuth(req, res, next),
    (req, res) => userController.me(req, res));

router.put('/profile', (req, res, next) => userMiddleware.isAuth(req, res, next), (req, res) => userController.updateProfile(req, res));

module.exports = router;