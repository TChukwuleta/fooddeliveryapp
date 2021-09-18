const express = require('express')
const customerController = require('../../controllers/User/userController')
const router = express.Router()
const { validateAuth } = require('../../middlewares/auth')

router.get('/', (req, res) => {
    res.send('This is the home page oo')
})
router.get('/test', validateAuth, customerController.testRoute)

// The User

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
router.get('/cart', customerController.getCart)
router.post('/cart', customerController.addToCart)
router.delete('/cart', customerController.deleteCart)

module.exports = router     