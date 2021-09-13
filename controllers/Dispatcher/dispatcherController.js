const dispatchProfile = require('../../models/Dispatcher/profileModel.js')

const dispatchAvailability = async (req, res) => {
    const pinCode = req.params.pincode
    const result = await dispatchProfile.find({ dCode: pinCode })

    if(result){
        const Moving = dispatchProfile.serviceAvailable
    }
    else{
        res.status(400).json({ "message": "Rider not found" })
    }
}

const register = (req, res) => {}

const login = (req, res) => {}

const getdispatcherProfile = (req, res) => {}

const updateDispatchProfile = (req, res) => {}


module.exports = {
    dispatchAvailability,
    register,
    login,
    getdispatcherProfile,
    updateDispatchProfile
}