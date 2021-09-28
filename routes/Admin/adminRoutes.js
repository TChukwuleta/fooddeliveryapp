const express = require('express')
const adminController = require('../../controllers/Admin/adminController')
const router = express.Router()
const multer = require('multer')
const { validateAuth } = require('../../middlewares/auth')


const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'images')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

// const images = multer({ storage: imageStorage }).array('images', 10)
const uploadImage = multer({ storage: imageStorage }).single('image')


router.get('/', (req, res) => {
    res.send('This is an admin')
})

// CREATE ADMIN PROFILE   
router.post('/register', adminController.registerAdmin)
router.post('/login', adminController.loginAdmin)
 

// CONTENT MANAGEMENT  
router.post('/product-create', validateAuth, uploadImage, adminController.createProduct)
router.get('/products', adminController.getProducts)
router.get('/product/:id', adminController.getProduct)
router.put('/product-update/:id', validateAuth, adminController.updateProduct)
router.post('/product-delete/:id', validateAuth, adminController.deleteProduct)

// Orders
router.get('/orders', validateAuth, adminController.getCurrentOrders)
router.put('/order/:id/process', adminController.processOrder) 
router.get('/order/:id', adminController.getOrderDetail)

// Discounts
router.get('/discounts', validateAuth, adminController.getDiscounts)
router.post('/discount', validateAuth, adminController.createDiscount)
router.put('/discount/:id', validateAuth, adminController.editDiscount)

// Transactions
router.get('/transactions', adminController.getTransaction)
router.get('/transaction/:id', adminController.getTransactionById)

// T
// router.use(validateAuth)
// router.post('/product-create', uploadImage, adminController.createProduct)

module.exports = router  