const express = require('express');
const router = express.Router();

const {UserRepository, RoleRepository} = require('../../repositories/global-repositories');
const {UserController} = require('../controllers/global-controllers');
const {EmailService, RedisService} = require('../../services/global-services');
const {UserMiddleware} = require("../middlewares/global-middlewares");

const userMiddleware = new UserMiddleware();
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const emailService = new EmailService();
const redisService = new RedisService();
const userController = new UserController(userRepository, roleRepository, redisService, emailService);

router.post('/sign-up', userMiddleware.validateSignUp, (req, res) => userController.signUp(req, res))

module.exports = router;