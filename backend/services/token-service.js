const jwt = require('jsonwebtoken')
const RefreshModel = require('../models/refresh-model')

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1h' /* '1m' */
        })
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y'
        })

        return { accessToken, refreshToken }
    }

    // to store referesh token to DB
    async storeRefreshToken(token, userId){
        try{
            await RefreshModel.create({
                token,
                userId,
            })
        }
        catch(err){
            console.log(err.message);
        }
    }

    // JWT verify for refreshToken
    async verifyAccessToken(token){
        return jwt.verify(token, accessTokenSecret) 
    }
    
    // JWT verify for refreshToken
    async verifyRefreshToken(refreshToken){
        return jwt.verify(refreshToken, refreshTokenSecret);
    }

    // checks if the refresh token exists in the DB
    async findRefreshToken(userId, refreshToken){
        return await RefreshModel.findOne({ userId: userId, token: refreshToken })
    }

    // updates refresh token in DB
    async updateRefreshToken(userId, refreshToken){
        return await RefreshModel.updateOne({ userId: userId}, { token: refreshToken })
    }

    async removeToken(refreshToken){
        return await RefreshModel.deleteOne({token: refreshToken})
    }
}

module.exports = new TokenService();