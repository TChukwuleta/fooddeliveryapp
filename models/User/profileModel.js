const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
        type: String,
        required: true
    },
    address: {
        type: String
    },
    verified: {
        type: Boolean,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    otp_expiry: {
        type: Date,
        required: true
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }
}, {
    timestamps: true
})

const userProfile = mongoose.model('userprofile', userSchema)

module.exports = userProfile