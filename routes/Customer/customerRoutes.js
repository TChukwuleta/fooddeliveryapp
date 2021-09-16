const express = require('express')
const customerController = require('../../controllers/Customer/customerController')
const router = express.Router()
const { validateAuth } = require('../../middlewares/auth')

router.get('/', (req, res) => {
    res.send('This is the home page oo')
}) 

router.post('/register', customerController.registerCustomer)
 
router.post('/login', customerController.loginCustomer)

router.get('/profile', validateAuth, customerController.getCustomerProfile)

router.put('/update', customerController.updateCustomerProfile)

router.get('/catalog', validateAuth, customerController.getCatalog)

router.post('/items', validateAuth, customerController.addItems)



 
module.exports = router  