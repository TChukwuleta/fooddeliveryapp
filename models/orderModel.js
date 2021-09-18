const mongoose = require('mongoose')
const schema = mongoose.Schema

const orderSchema = new schema({
    orderId: {
        type: String
    },
    items: [{
        item: {
            type: schema.Types.ObjectId,
            ref: 'productcatalog',
            // required: true
        },
        unit: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date
    }, 
    paidThrough: {
        type: String
    },
    PaymentResponse: {
        type: String 
    },
    orderStatus: {
        type: String
    }
}, {
    timestamps: true
})

const myOrder = mongoose.model('order', orderSchema)

module.exports = myOrder