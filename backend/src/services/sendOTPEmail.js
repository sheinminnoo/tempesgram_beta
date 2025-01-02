const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD // Your email password or app password
    }
});

exports.sendOTPEmail = async (email, otp, profileName) => {
    try {
        const templatePath = path.join(__dirname, '../views/otpEmail.ejs');
        
        const html = await ejs.renderFile(templatePath, { otp, profileName });

        const mailOptions = {
            from: 'Tempest.Social <sendOTP@gmail.com>', // Custom sender name
            to: email, // Recipient's email
            subject: 'Secure Your Account - OTP Verification',
            html // Use the rendered EJS HTML
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Error sending OTP email');
    }
};
