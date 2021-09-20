const express = require('express')
const adminController = require('../../controllers/Admin/adminController')
const router = express.Router()
const { validateAuth } = require('../../middlewares/auth')

router.get('/', (req, res) => {
    res.send('This is an admin')
})

// CREATE ADMIN PROFILE  
router.post('/register', adminController.registerAdmin)
router.post('/login', adminController.loginAdmin)
 

// CONTENT MANAGEMENT  
router.post('/product-create', validateAuth, adminController.createProduct)
router.get('/products', adminController.getProducts)
router.get('/product/:id', adminController.getProduct)
router.put('/product-update/:id', validateAuth, adminController.updateProduct)
router.post('/product-delete/:id', validateAuth, adminController.deleteProduct)

// Orders
router.get('/orders', validateAuth, adminController.getOrders)
router.put('/order/:id/process', adminController.processOrder)
router.get('/order/:id', adminController.getOrderDetail)

// Discounts
router.get('/discounts', validateAuth, adminController.getDiscounts)
router.post('/discount', validateAuth, adminController.createDiscount)
router.put('/discount/:id', validateAuth, adminController.editDiscount)

module.exports = router  