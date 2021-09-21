const mongoose = require('mongoose')
const schema = mongoose.Schema

const profileSchema = new schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dCode: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    serviceAvailable: { 
        type: Boolean,
        default: false
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    wantsToRide: {
        type: Boolean,
        default: false
    }
})

const dispatchProfile = mongoose.model('dispatchprofile', profileSchema)
module.exports = dispatchProfile
 