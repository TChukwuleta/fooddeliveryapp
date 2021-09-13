const express = require('express')
const customerController = require('../../controllers/User/userController')
const router = express.Router()
const { validateAuth } = require('../../middlewares/auth')

router.get('/', (req, res) => {
    res.send('This is the home page oo')
})

// PROFILE

// Sign Up
router.post('/register', customerController.registerCustomer)

// Login
router.post('/login', customerController.loginCustomer)


//Authentication
// Verify user account
router.patch('/verify', customerController.verifyCustomer)

// OTP / Requesting OTP
router.get('/otp', customerController.requestOTP)

// Profile
router.get('/profile', validateAuth, customerController.getCustomerProfile)
router.put('/update', customerController.updateCustomerProfile)


module.exports = router  