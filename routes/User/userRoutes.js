const express = require('express')
const customerController = require('../../controllers/User/userController')
const router = express.Router()
const { validateAuth } = require('../../middlewares/auth')

router.get('/', (req, res) => {
    res.send('This is the home page oo')
})
router.get('/test', validateAuth, customerController.testRoute)


// Sign Up
router.post('/register', customerController.registerCustomer)
// Login
router.post('/login', customerController.loginCustomer)
// Profile
router.get('/profile', validateAuth, customerController.getCustomerProfile)
router.put('/update', validateAuth, customerController.updateCustomerProfile)
 
// Orders
router.post('/create-order', validateAuth, customerController.createOrder)
router.get('/orders', validateAuth, customerController.getOrders)
router.get('/order/:id', customerController.getOrderById)

// Cart
router.get('/cart', validateAuth, customerController.getCart)
router.post('/cart', validateAuth, customerController.addToCart)
router.delete('/cart', validateAuth, customerController.deleteCart)

// Discount
router.get('/discount/:pincode', customerController.getAvailableDiscount)
router.get('/discount/verify/:id', validateAuth, customerController.verifyDiscount)

// Payment
router.post('/create-payment', validateAuth, customerController.createPayment)

module.exports = router     