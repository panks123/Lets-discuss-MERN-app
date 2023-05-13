const otpService = require('../services/otp-service')
const hashService = require('../services/hash-service')
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDTO = require('../dtos/user-dto')

class AuthController {
    async sendOTP(req, res) {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: "Phone field is required!" })
        }
        try {
            // generate OTP
            const otp = await otpService.generateOTP()

            const ttl = 1000 * 60 * 20 // OTP expiration time in 
            const expires = Date.now() + ttl; // for 2 minutes after the current time
            const data = `${phone}.${otp}.${expires}` // for separating the hash in 3 parts with dot 
            // hash OTP
            const hash = hashService.hashOTP(data)

            // send OTP to user's Phone
            // await otpService.sendOTPBySMS(phone, otp); // temporarily commenting this line
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp // temporarily adding for testing
            })
        }
        catch (err) {
            console.log(err.message)
            return res.status(500).send("Internal server error")
        }
    }

    async verifyOTP(req, res) {
        const { phone, otp, hash } = req.body;

        if (!otp || !hash || !phone) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        try {
            const [hashedOTP, expires] = hash.split('.') // the hash which we had separated with . , here we are splitting

            if (Date.now() > +expires) { // '+expires' converts the string 'expires' to number
                // If the OTP has expired
                return res.status(400).json({ message: 'This OTP has expired!' })
            }

            const data = `${phone}.${otp}.${expires}`; // user's data

            // verifying the user's OTP
            const isValidOTP = otpService.verifyOTP(hashedOTP, data)

            if (!isValidOTP) {
                console.log('Invalid otp was passed by the client')
                return res.status(400).json({ message: "Invalid OTP!" })
            }

            // create user and access and refresh tokens
            let user;
            try {

                user = await userService.findUser({ phone });

                if (!user) {
                    // If user is not a registred user
                    user = await userService.createUser({ phone })
                }
            }
            catch (err) {
                console.log(err.message)
                return res.status(500).json({ message: "Internal server error" })
            }

            // Token
            const { accessToken, refreshToken } = tokenService.generateTokens({ _id: user._id, activated: false });
            // store the refresh token in DB
            tokenService.storeRefreshToken(refreshToken, user._id)

            // set the refersh token as cookie
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // for 30 days validity of cookie
                httpOnly: true
            })
            // set the access token as cookie
            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // for 30 days validity of cookie
                httpOnly: true
            })

            // send the accessToken
            const userDTO = new UserDTO(user)
            return res.json({ user: userDTO, authenticated: true });
        }
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async refresh(req, res) {
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies; // { refreshToken: refreshTokenFromCookie } -> this is just an aliasing ( uswed to prevent name conflict for refreshToken variable)

        // check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);

        }
        catch (err) {
            console.log(err.message)
            // user invalid
            return res.status(401).json({ message: "Invalid token1" })
        }

        // check if the token is in database

        try {
            const token = tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);

            if (!token) {
                return res.status(401).json({ message: "Invalid token2" })
            }
        }
        catch (err) {
            console.log(err.message)
            // user invalid
            return res.status(500).json({ message: "Internal server error" })
        }
        // check if valid user
        let user;
        try {
            user = await userService.findUser({ _id: userData._id })
            if (!user) {
                return res.status(401).json({ message: "No such user exists" })
            }
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ message: "Internal server error" })
        }

        // Generate new tokens (access + refresh tokens)
        const { accessToken, refreshToken } = tokenService.generateTokens({ _id: userData._id });

        // update refresh token in the database
        try{
            await tokenService.updateRefreshToken( userData._id, refreshToken );
        }
        catch(err){
            console.log(err.message);
            return res.status(500).json({ message: "Internal server error" })
        }
        
        // put the tokens in cookie
        // set the refersh token as cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // for 30 days validity of cookie
            httpOnly: true
        })
        // set the access token as cookie
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // for 30 days validity of cookie
            httpOnly: true
        })

        // send the response
        // send the accessToken
        const userDTO = new UserDTO(user)
        res.json({ user: userDTO, authenticated: true });
    }

    async logout(req, res){
        const { refreshToken } = req.cookies;
        // delete refresh-token from DB
        await tokenService.removeToken(refreshToken)
        // delete cookies
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        // send response
        // const userDTO = new UserDTO(null) //
        return res.json({ user: null, auth: false })
    } 
}

module.exports = new AuthController();