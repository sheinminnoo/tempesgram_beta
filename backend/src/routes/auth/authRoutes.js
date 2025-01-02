const express = require('express');
const register = require('../../controllers/auth/register');
const login = require('../../controllers/auth/login');
const { body } = require('express-validator');
const errorValidator = require('../../middlewares/errorValidator');
const verifyOTP = require('../../controllers/auth/verify_otp');
const authRoutes = express.Router();

// Register route
authRoutes.post('/auth/register',
    body('profileName')
        .notEmpty().withMessage('Profile name is required')
        .isLength({ min: 1, max: 50 }).withMessage('Profile name must be between 1 and 50 characters long'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('cpassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    errorValidator,  
    register
);

// Login route
authRoutes.post('/auth/login',
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    errorValidator,  
    login
);

// verifyOTP route
authRoutes.post('/auth/verify-otp',
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('otp').notEmpty().withMessage('OTP is required'),
    errorValidator,
    verifyOTP);

module.exports = authRoutes;
