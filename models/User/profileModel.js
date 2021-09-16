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
    orders: [{
        type: schema.Types.ObjectId,
        ref: 'order'
    }]
}, {
    timestamps: true
})

const userProfile = mongoose.model('userprofile', userSchema)

module.exports = userProfile