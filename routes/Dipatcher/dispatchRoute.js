const express = require('express')
const { validateAuth } = require('../../middlewares/auth')
const dispatchController = require('../../controllers/Dispatcher/dispatcherController')
const router = express.Router()

// PROFILES
router.post('/register', validateAuth, dispatchController.registerRider)

router.post('/login', dispatchController.loginRider)

router.get('/profile', validateAuth, dispatchController.getdispatcherProfile)

router.put('/update/:dCode', dispatchController.updateDispatchProfile)

router.get('/:pincode', dispatchController.dispatchAvailability)

router.put('/change-status', validateAuth, dispatchController.updateServiceAvalilability)


module.exports = router
