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

router.post('/auth/sign-up', middleware.validateSignUp, (req, res) => userController.signUp(req, res));
router.post('/auth/send-verification', (req, res) => userController.sendVerificationToEmail(req, res));
router.post('/auth/check-verification', (req, res) => userController.checkVerificationToken(req, res));

router.post('/auth/sign-in', (req, res) => userController.signIn(req, res));

router.post('/auth/logout', (req, res) => userController.logout(req, res));

router.get('/auth/refresh', (req, res) => userController.refreshToken(req, res));

router.post('/password/send-token', (req, res) => userController.sendPasswordResetToken(req, res));
router.put('/password/change', (req, res) => userController.checkPasswordTokenAndResetPassword(req, res));

router.get(
    '/profile',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res) => userController.me(req, res)
);

router.put(
    '/profile/update',
    (req, res, next) => middleware.isAuth(req, res, next),
    (req, res) => userController.updateProfile(req, res)
);

module.exports = router;