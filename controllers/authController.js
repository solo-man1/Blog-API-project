const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const { generateAccessToken, generateRefreshToken } = require('../services/tokenService');

// POST /api/auth/register — Register a new user
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ 
            success: false, 
            message: 'User with this email already exists' 
        });
    }

    // Create the user (password is hashed automatically by User model pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to the database (since it is in your User schema)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        accessToken,
        refreshToken,
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email 
        }
    });
});

// POST /api/auth/login — Login existing user
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide both email and password' 
        });
    }

    // Find user (We must use .select('+password') because it is hidden in your schema)
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists AND if password matches
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid email or password' 
        });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email 
        }
    });
});