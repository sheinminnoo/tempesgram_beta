const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    try {
        const JWT_SECRET = process.env.JWT || "secret";
        return jwt.sign({ userId }, JWT_SECRET, {
            expiresIn: "1h", // Token valid for 1 hour
        });
    } catch (error) {
        console.error("Error generating token:", error.message);
        throw new Error("Token generation failed");
    }
};

module.exports = generateToken;
