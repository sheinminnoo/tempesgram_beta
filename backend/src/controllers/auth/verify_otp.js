const User = require("../../models/User");

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Check if email and otp are provided
        if (!otp || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user exists
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(404).json({ message: "User does not exist" });
        }
        
        // Check if the OTP is correct
        console.log('OTP:', otp);   
        console.log('Check User OTP:', checkUser.otp);  
        if (otp !== checkUser.otp) {
            return res.status(401).json({ message: "Incorrect OTP" });
        }

        console.log('Current Time:', Date.now());
        console.log('OTP Expiration Time:', checkUser.otpExpires);

        // Check if the OTP has expired
        const currentTime = Date.now();
        if (currentTime > checkUser.otpExpires) {
            return res.status(401).json({ message: "OTP has expired" });
        }
        // Update user as verified and clear OTP details
        checkUser.isVerified = true;
        checkUser.otp = null;        // Nullify the OTP after successful verification
        checkUser.otpExpires = null; // Nullify the OTP expiration time
        await checkUser.save(); // Save the updated user details

        return res.status(200).json({
            message: "Email verified successfully",
            redirectTo: "/login" // Redirect to login page after successful verification
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = verifyOTP;
