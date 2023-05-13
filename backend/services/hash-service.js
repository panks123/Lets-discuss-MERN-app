const crypto = require('crypto')

class HashSevice{
    hashOTP(otp)
    {
        return crypto.createHmac('sha256', process.env.HASH_SECRET_KEY).update(otp).digest('hex') // this will return hashed OTP in string format
    }
}

module.exports = new HashSevice()