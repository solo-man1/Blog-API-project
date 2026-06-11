require('dotenv').config();
const { generateAccessToken } = require('./services/tokenService');

// A fake user ID for testing purposes (must be a valid MongoDB ObjectId format)
const testUserId = "60d0fe4f5311236168a109ca"; 

// USING YOUR EXISTING SERVICE!
const token = generateAccessToken(testUserId);

console.log("\n=== COPY YOUR TEST TOKEN ===");
console.log(`Bearer ${token}\n`);