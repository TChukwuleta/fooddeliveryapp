const express = require('express')
const { validateAuth } = require('../../middlewares/auth')
const dispatchController = require('../../controllers/Dispatcher/dispatcherController')
const router = express.Router()

// PROFILES
router.post('/register', validateAuth, dispatchController.registerRider)

router.post('/login', dispatchController.loginRider)

router.get('/profile', validateAuth, dispatchController.getdispatcherProfile)

router.put('/update/:pincode', dispatchController.updateDispatchProfile)

router.get('/:pincode', dispatchController.dispatchAvailability)


module.exports = router
