const express = require('express')
const adminController = require('../../controllers/Admin/adminController')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('This is an admin')
})

// CREATE ADMIN PROFILE 
router.post('/register', adminController.registerAdmin)

router.get('/login', adminController.loginAdmin)


// CONTENT MANAGEMENT 

router.post('/product-create', adminController.createProduct)

router.get('/products', adminController.getProducts)

router.get('/product/:id', adminController.getProduct)

router.put('/product-update', adminController.updateProduct)

router.post('/product-delete/:id', adminController.deleteProduct)

module.exports = router