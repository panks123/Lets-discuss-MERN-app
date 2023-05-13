const crypto = require('crypto')
const hashService = require('../services/hash-service')

const SMS_SID = process.env.TWILIO_SMS_SID
const SMS_AUTH_TOKEN = process.env.TWILIO_SMS_AUTH_TOKEN
const SMS_FROM_NUMBER = process.env.TWILIO_SMS_FROM_PHONE_NUMBER

const twilio = require('twilio')(SMS_SID, SMS_AUTH_TOKEN,{
    lazyLoading: true, // for optimized performance in sms sending
}) 


class OTPService{
    async generateOTP(){
        const otp = crypto.randomInt(1000, 9999) // Generates a random 4 digit OTP
        return otp
    }

    async sendOTPBySMS(phone_no, otp){
        return await twilio.messages.create({
            to: phone_no, // to the phone number which we want to send the OTP SMS
            from: SMS_FROM_NUMBER, // Phone number provided by Twilio from which the SMS will be sent
            body: `Your Let's Discuss OTP is: ${otp}` // OTP message
        })
    }

    verifyOTP(hashedOTP, data){
        // compute hash based on user's OTP data
        let computedHash = hashService.hashOTP(data)

        // compare the computedHash with actual hashedOTP
        return computedHash === hashedOTP ? true : false;
    }
}

module.exports = new OTPService();