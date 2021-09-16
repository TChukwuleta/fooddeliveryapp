const mongoose = require('mongoose')
const schema = mongoose.Schema

const orderSchema = new schema({
    orderId: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    items: [{
        food: {
            type: schema.Types.ObjectId,
            ref: 'usercatalog',
            required: true
        },
        unit: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date
    }, 
    paidThrough: {
        type: String
    },
    PaymentResponse: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String
    }
}, {
    timestamps: true
})

const myOrder = mongoose.model('order', orderSchema)

module.exports = myOrder