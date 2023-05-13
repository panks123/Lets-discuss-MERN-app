const tokenService = require("../services/token-service");

module.exports = async (req, res, next)=>{
    try{
        // get the accessToken from cookies
        const { accessToken } = req.cookies; // Make sure to use cookie-parser middleware in the express application
        // console.log(accessToken)
        if(!accessToken)
        {
            throw new Error();
        }
        // verify the token
        const userData = await tokenService.verifyAccessToken(accessToken);
        // console.log(userData)
        // if user was not verified 
        if(!userData){
            throw new Error()
        }

        // We will attach the property 'user' to the req object
        req.user = userData;

        next()
    }
    catch(err){
        return res.status(401).json({ message: 'Invalid token'})
    }
}