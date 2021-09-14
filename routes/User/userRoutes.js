const express = require('express')
const customerController = require('../../controllers/User/userController')
const router = express.Router()
const { validateAuth } = require('../../middlewares/auth')

router.get('/', (req, res) => {
    res.send('This is the home page oo')
})
router.get('/test', validateAuth, customerController.testRoute)

// PROFILE

// Sign Up
router.post('/register', customerController.registerCustomer)

// Login
router.post('/login', customerController.loginCustomer)


// Profile
router.get('/profile', validateAuth, customerController.getCustomerProfile)
router.put('/update', validateAuth, customerController.updateCustomerProfile)


module.exports = router  