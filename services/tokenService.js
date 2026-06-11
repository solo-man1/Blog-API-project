const jwt=require('jsonwebtoken');
const generateAccessToken=(userId)=>{
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {expiresIn:900}
    );
};
const generateRefreshToken=(userId)=>{
    return jwt.sign
    (
        {id:userId},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:604800}
    );
};
const verifyRefreshToken=(token)=>{
    return jwt.verify(token,process.env.JWT_REFRESH_SECRET);
};
module.exports={
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
};