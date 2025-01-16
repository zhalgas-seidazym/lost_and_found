const crypto = require('crypto');
const {hashPassword, comparePassword} = require('../../utils/bcrypt')
const {jwtEncode, jwtDecode} = require('../../utils/jwt');

class UserController {
    constructor(userRepository, roleRepository, redisService, emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.redisService = redisService;
        this.emailService = emailService;
    }

    async signIn(req, res) {
        const { email, password } = req.body;

        try{
            const user = await this.userRepository.findByEmail(email);
            if(!user){
                return res.status(401).json({ detail: "Invalid email or password." });
            }

            const isPasswordMatch = await comparePassword(password, user.password);
            if(!isPasswordMatch){
                return res.status(401).json({ detail: "Invalid email or password." });
            }

            const role = await this.roleRepository.findById(user.roleId);

            const payload = {userId: user.id}
            const accessToken = jwtEncode(payload);
            const refreshToken = jwtEncode(payload, "7d");

            res.status(200).json({
                accessToken,
                refreshToken,
                role: role.name
            });
        }catch(error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error."});
        }
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

            await this.redisService.set(`creation-email:${user.email}`, user, 60 * 60);

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
            user = await this.redisService.get("creation-email:" + email);
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
                `creation-email:${user.email}`, user, 60 * 60
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

            let user = await this.redisService.get(`creation-email:${token.email}`);
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
                telegram: 'Unknown',
                phoneNumber: 'Unknown',
            });
            await this.redisService.delete(`creation-email:${token.email}`);

            res.status(201).json({detail: "User created successfully."});
        }catch (error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error."});
        }
    }

    async refreshToken(req, res){
        const {refreshToken} = req.body;

        try{
            if(!refreshToken){
                return res.status(401).json({detail: 'Refresh token is invalid or expired.'});
            }

            let decoded;
            try{
                decoded = jwtDecode(refreshToken);
            }catch(error){
                res.status(401).json({detail: 'Refresh token is invalid or expired.'});
            }

            if (!decoded || !decoded.userId) {
                return res.status(401).send({detail: "Refresh token is invalid or expired."});
            }

            const dbUser = await this.userRepository.findById(decoded.userId);
            if (!dbUser) {
                return res.status(401).send({detail: "Refresh token is invalid or expired."});
            }

            const payload = {userId: dbUser.id};
            const accessToken = jwtEncode(payload);
            const newRefreshToken = jwtEncode(payload, '7d');

            return res.status(200).send({accessToken, refreshToken: newRefreshToken});
        }catch (error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error."});
        }
    }

    async sendPasswordResetToken(req, res){
        const {email, redirectUrl} = req.body;

        try{
            const user = await this.userRepository.findByEmail(email);
            if(!user){
                return res.status(404).json({detail: 'User with this email does not exist.'});
            }

            const token = crypto.randomBytes(32).toString('hex');

            await this.redisService.set(
                `password-token:${token}`,
                email,
                900
            );

            const newRedirectUrl = redirectUrl + '?token=' + token;

            await this.emailService.sendPasswordResetToken(email, newRedirectUrl);

            res.status(200).json({detail: 'Password reset link sent successfully.'});
        }catch(error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error."});
        }
    }

    async checkPasswordTokenAndResetPassword(req, res){
        const {token} = req.query;
        const {newPassword} = req.body;

        try{
            if(!token){
                return res.status(401).json({detail: 'Reset token is invalid or expired.'});
            }
            if(!newPassword || newPassword.length < 4){
                return res.status(400).json({detail: 'New password is invalid.'})
            }

            let email = await this.redisService.get(`password-token:${token}`);
            if(!email){
                return res.status(401).json({detail: 'Reset token is invalid or expired.'});
            }
            const user = await this.userRepository.findByEmail(email);
            if(!user){
                return res.status(400).json({detail: 'Reset token is invalid or expired.'});
            }
            user.password = await hashPassword(newPassword);
            await user.save();
            await this.redisService.delete(`password-token:${token}`);

            res.status(200).json({detail: 'Password reset successfully.'});
        }catch(error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error."});
        }
    }

    async me(req, res){
        const user = req.user;

        try{
            return res.status(200).json({
                name: user.name,
                surname: user.surname,
                email: user.email,
                telegram: user.telegram,
                phoneNumber: user.phoneNumber
            });
        }catch(error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error."});
        }
    }

    async updateProfile(req, res){
        const {
            name = null,
            surname = null,
            password = null,
            newPassword = null,
            telegram = null,
            phoneNumber = null
        } = req.body;

        try{
            const user = req.user;
            const newData = {
                name: name || user.name,
                surname: surname || user.surname,
                phoneNumber: phoneNumber || user.phoneNumber,
                telegram: telegram || user.telegram,
            };

            if (password) {
                if (!await comparePassword(password, user.password)) {
                    return res.status(403).send({detail: 'Password is incorrect.'});
                }
                newData.password = await hashPassword(newPassword);
            }

            const updatedUser = await this.userRepository.update(user.id, newData);

            if (!updatedUser) {
                return res.status(404).send({detail: 'User not found.'});
            }

            return res.status(204).send({
                detail: 'Profile updated successfully.'
            });
        }
        catch(error){
            console.log(error.message);
            res.status(500).json({"detail": "Internal Server Error."});
        }
    }
}

module.exports = UserController;