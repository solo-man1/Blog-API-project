const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // 1. Check if the header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized -- no token provided'
        });
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Find the user by ID, but specifically exclude the password from the result
        const user = await User.findById(decoded.id).select('-password');
        
        // 5. Ensure the user hasn't been deleted from the database
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        // 6. Attach the user to the request object so controllers can access it
        req.user = user;
        next();
        
    } catch (error) {
        //Cleanly catch errors if the token is expired or mathematically invalid
        return res.status(401).json({
            success: false,
            message: 'Not authorized -- invalid or expired token'
        });
    }
});

module.exports = protect;