const crypto = require('crypto');

const generateOTP = () =>{
    const otp = crypto.randomBytes(3).toString('hex').slice(0,6);
    const otpExpires =  Date.now() + 600000; // 10 minutes

    const formattedExpires = new Date(otpExpires).toLocaleString();
    return { otp, otpExpires, formattedExpires };
}

module.exports = generateOTP;