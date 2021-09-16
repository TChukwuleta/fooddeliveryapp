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

module.exports = router  