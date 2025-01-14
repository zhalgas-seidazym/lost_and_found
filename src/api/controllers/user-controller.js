const crypto = require('crypto');
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
                return res.status(409).send({detail: 'User with this email already exists.'});
            }

            const roleId = await this.roleRepository.findByName('client')

            const hashedPassword = await hashPassword(password);
            let user = {name, surname, email, password: hashedPassword, roleId: roleId.id};

            await this.redisService.set(`user-email:${user.email}`, user, 60 * 60);

            return res.status(200).json({detail: "Please pass verification to finish creating user."});
        }catch (error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error."});
        }
    }

    async sendVerificationToEmail(req, res){
        const {email, redirectUrl} = req.body;

        try{
            let user = await this.userRepository.findByEmail(email);
            if(user){
                return res.status(409).send({detail: 'Account with this email already verified.'});

            }
            user = await this.redisService.get("user-email:" + email);
            user = JSON.parse(user);
            if(!user){
                return res.status(404).send({detail: 'Account with this email not found.'});
            }
            let tokenRedis = await this.redisService.get(`verification-token:${user.token}`);
            tokenRedis = JSON.parse(tokenRedis);
            if(tokenRedis && tokenRedis.resendTime > Date.now()){
                const remainingTime = Math.ceil((tokenRedis.resendTime - Date.now()) / 1000);
                return res.status(429).json({ detail: `Please wait ${remainingTime} seconds before resending.` });
            }

            const verToken = crypto.randomBytes(32).toString('hex');

            await this.redisService.delete(`verification-token:${user.token}`);
            user.token = verToken;

            await this.redisService.set(
                "verification-token:" + verToken,
                JSON.stringify({
                    email: user.email,
                    resendTime: Date.now() + 60 * 1000
                }),
                900
            );

            await this.redisService.set(
                `user-email:${user.email}`, user, 60 * 60
            )

            const newRedirectUrl = redirectUrl + '?token=' + verToken;
            await this.emailService.sendVerifyEmail(email, newRedirectUrl);

            return res.status(200).json({detail: "Account verification sent successfully."});
        }catch (error){
            console.log(error.message);
            res.status(500).json({detail: "Internal Server Error."});
        }
    }

    async checkVerificationToken(req, res){
        const {verificationToken} = req.query;

        try{
            let token = await this.redisService.get(`verification-token:${verificationToken}`);
            token = JSON.parse(token);
            if(!token){
                return res.status(401).send({detail: 'Verification token is invalid or expired.'});
            }

            let user = await this.redisService.get(`user-email:${token.email}`);
            user = JSON.parse(user);
            if(!user){
                return res.status(401).send({detail: 'Verification token is invalid or expired.'});
            }

            await this.userRepository.create({
                name: user.name,
                surname: user.surname,
                email: user.email,
                password: user.password,
                roleId: user.roleId,
            })

            res.status(201).json({detail: "User created successfully."});
        }catch (error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error."});
        }
    }
}

module.exports = UserController;