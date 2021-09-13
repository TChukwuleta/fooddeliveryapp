const express = require('express')
const { validateAuth } = require('../../middlewares/auth')
const dispatchController = require('../../controllers/Dispatcher/dispatcherController')
const router = express.Router()

// PROFILES
router.post('/register', dispatchController.register)

router.post('/login', dispatchController.login)

router.get('/profile', validateAuth, dispatchController.getdispatcherProfile)

router.put('/update', dispatchController.updateDispatchProfile)

router.get('/:pincode', dispatchController.dispatchAvailability)


module.exports = router
