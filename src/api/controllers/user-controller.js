const {hashPassword, comparePassword} = require('../../utils/bcrypt')

class UserController {
    constructor(userRepository, roleRepository, redisService, emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.redisService = redisService;
        this.emailService = emailService;
    }

    async signUp(req, res){
        const {name, surname, email, password} = req.body;

        try{
            let exists = await this.userRepository.findByEmail(email);
            if(exists){
                return res.status(409).send({error: 'User with this email already exists'});
            }

            const roleId = await this.roleRepository.findByName('client');

            const hashedPassword = await hashPassword(password);
            let newUser = {name, surname, email, password: hashedPassword, roleId: roleId.id};

            await this.userRepository.create(newUser);

            return res.status(201).json({detail: "User created successfully."});

        }catch (error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error"});
        }
    }

}

module.exports = UserController;