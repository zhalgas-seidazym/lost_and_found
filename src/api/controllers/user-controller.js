

class UserController {
    constructor(userRepository, redisService, emailService) {
        this.userRepository = userRepository;
        this.redisService = redisService;
        this.emailService = emailService;
    }


}