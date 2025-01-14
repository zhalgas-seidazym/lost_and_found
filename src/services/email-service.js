const nodemailer = require('nodemailer');
const config = require('./../config/config');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: config.emailService || 'gmail',
            auth: {
                user: config.rootEmail,
                pass: config.rootEmailPass
            }
        });
    }

    async sendEmail(mailOptions) {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    generatePasswordResetHtml(resetLink) {
        return `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f4f4f4;">
                <div style="text-align: center; padding: 10px; background-color: #4CAF50; color: #ffffff;">
                    <h1 style="margin: 0;">Lost & Found Service</h1>
                </div>
                <div style="background-color: #ffffff; padding: 20px; margin-top: 20px; border-radius: 5px;">
                    <h2 style="color: #4CAF50; margin-top: 0;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
                    <p>To reset your password, click the button below:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>This link will expire in 15 minutes for security reasons.</p>
                    <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                    <p style="word-break: break-all; color: #4CAF50;">${resetLink}</p>
                    <p>If you didn't request a password reset, please contact our support team immediately.</p>
                    <p>Best regards,<br>Your Company Team</p>
                </div>
                <div style="text-align: center; font-size: 12px; color: #888888; margin-top: 20px;">
                    <p>&copy; 2024 Lost & Found Service. All rights reserved.</p>
                    <p>Abylaikhan 1</p>
                </div>
            </div>
        `;
    }

    generateEmailVerificationHtml(verificationLink) {
        return `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f4f4f4;">
                <div style="text-align: center; padding: 10px; background-color: #4CAF50; color: #ffffff;">
                    <h1 style="margin: 0;">Lost & Found Service</h1>
                </div>
                <div style="background-color: #ffffff; padding: 20px; margin-top: 20px; border-radius: 5px;">
                    <h2 style="color: #4CAF50; margin-top: 0;">Email Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for registering with us. To complete your registration and verify your email address, please click the button below:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                    </div>
                    <p>This link will expire in 15 minutes for security reasons.</p>
                    <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                    <p style="word-break: break-word; color: #4CAF50;">${verificationLink}</p>
                    <p>If you did not request this verification or believe you received this email in error, please disregard it. No action is required on your part.</p>
                    <p>Thank you for choosing our service!</p>
                    <p>Best regards,<br>Your Company Team</p>
                </div>
                <div style="text-align: center; font-size: 12px; color: #888888; margin-top: 20px;">
                    <p>&copy; 2024 Lost & Found Service. All rights reserved.</p>
                    <p>Abylaikhan 1</p>
                </div>
            </div>
        `;
    }

    async sendPasswordResetEmail(to, resetLink) {
        const mailOptions = {
            from: config.rootEmail,
            to: to,
            subject: 'Password Reset Request',
            html: this.generatePasswordResetHtml(resetLink)
        };

        return await this.sendEmail(mailOptions);
    }

    async sendVerifyEmail(to, verificationLink) {
        const mailOptions = {
            from: config.rootEmail,
            to: to,
            subject: 'Email Verification',
            html: this.generateEmailVerificationHtml(verificationLink)
        };

        return await this.sendEmail(mailOptions);
    }

    async sendGeneralEmail(to, subject, body) {
        const mailOptions = {
            from: config.rootEmail,
            to: to,
            subject: subject,
            html: body
        };

        return await this.sendEmail(mailOptions);
    }
}

module.exports = EmailService;