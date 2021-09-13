const mongoose = require('mongoose')
const schema = mongoose.Schema

const profileSchema = new schema({
    name: {
        type: String,
        required: true
    },
    dCode: {
        type: String
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
        type: Number
    },
    serviceAvailable: {
        type: Boolean,
        default: false
    },
    wantsToRide: {
        type: Boolean,
        default: false
    }
})

const dispatchProfile = mongoose.model('dispatchProfile', profileSchema)
module.exports = dispatchProfile
 