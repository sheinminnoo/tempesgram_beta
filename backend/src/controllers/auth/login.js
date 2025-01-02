const User = require("../../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../../services/generateToken");
const generateOTP = require("../../services/generateOTP");
const { sendOTPEmail } = require("../../services/sendOTPEmail");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check if user exists
        const checkUser = await User.findOne({ email }).select("+password"); // include password field if hidden
        if (!checkUser) {
            return res.status(401).json({ msg: "User does not exist" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, checkUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Incorrect password" });
        }

        // Check if the user's email is verified
        if (!checkUser.isVerified) {
            const { otp, otpExpires , formattedExpires } = generateOTP(); // Generates OTP and expiration time

            checkUser.otp = otp;
            checkUser.otpExpires = otpExpires;
            await checkUser.save();

            // Send OTP email
            await sendOTPEmail(checkUser.email, otp, checkUser.profileName);

            return res.status(403).json({
                msg: "Email not verified. OTP sent to your email",
                redirectTo: "/verify-email",
                otpExpires : formattedExpires
            });
        }

        // Generate token and set cookie
        const token = generateToken(checkUser._id);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true, // Use secure only in production with HTTPS
            sameSite: "none",
            maxAge: 3600000, // 1 hour
        });

        return res.status(200).json({ msg: "Login successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = login;
