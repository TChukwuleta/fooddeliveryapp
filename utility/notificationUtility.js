// Email

// Notification

//OTP
const generateOTP = () => {
    const otp = Math.floor(10000 + Math.random() * 900000)
    let expiry = new Date()
    expiry.setTime( new Date().getTime() + ( 30 * 60 * 1000))
    return {
        otp,
        expiry
    }
}

// Payment Notifications or emails


module.exports = {
    generateOTP
}