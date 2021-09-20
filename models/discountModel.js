const mongoose = require('mongoose')
const schema = mongoose.Schema

const discountSchema = new schema({
    discountType: {
        type: String,
        required: true
    },
    theAdmin: [{
        type: schema.Types.ObjectId,
        ref: 'adminProfile'
    }],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    minValue: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    startValidity: {
        type: Date
    },
    endValidity: {
        type: Date
    },
    promocode: {
        type: String,
        required: true
    },
    promotype: {
        type: String,
        required: true
    },
    bank: [{
        type: String
    }],
    bins: [{
        type: Number
    }],
    pincode: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean
    }
})

const Discount = mongoose.model('discount', discountSchema)

module.exports = Discount