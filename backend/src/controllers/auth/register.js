const User = require("../../models/User");
const bcrypt = require("bcrypt");
const generateOTP = require("../../services/generateOTP");
const { sendOTPEmail } = require("../../services/sendOTPEmail");

const register = async (req, res) => {
    try{
        const {profileName, email, password ,cpassword} = req.body;

        if(!profileName || !email || !password || !cpassword){
            return res.status(400).json({msg : "All fields are required"});
        }
        // Check if the user already exists
        const checkemail = await User.findOne({email});
        if(checkemail){
            return res.status(400).json({msg : "User already exists"});
        }
        // validate profileName
        if(profileName.length <= 4 || profileName.length > 50){
            return res.status(400).json({msg : "Profile name should be between 4 to 50 characters"});
        }

        // validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({msg : "Invalid email"});
        }

        // validate password
        if(password.length < 8){
            return res.status(400).json({msg : "Password should be atleast 8 characters"});
        }

        if(password !== cpassword){
            return res.status(400).json({msg : "Password and Confirm Password should be same"});
        }   

        // Hash the password
        const hashValue = await bcrypt.hash(password, 10);  // 10 is the salt value

        const { otp , otpExpires , formattedExpires } = generateOTP();

        // Create a new user
        const newUser = await User.create({
            profileName,
            email,
            password : hashValue,
            otp : otp,
            otpExpires : formattedExpires
        });
        await sendOTPEmail(email, otp, profileName);
        return res.status(201).json({
            msg : "Registered successfully. Please verify your email.",
            redirectTo : "/verify-email",
            otpExpires, email
        });

    }catch(err){
        console.log(err);
        res.status(500).json({msg : "Internal Server Error"});
    }
}

module.exports = register;