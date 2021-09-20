const mongoose = require('mongoose')
const schema = mongoose.Schema

const orderSchema = new schema({
    orderId: {
        type: String,
        required: true
    },
    adminId: {
        type: String,
        require: true
    },
    items: [{
        item: {
            type: schema.Types.ObjectId,
            ref: 'productcatalog'
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
    },
    remarks: {
        type: String
    },
    deliveryId: {
        type: String
    },
    appliedDiscount: {
        type: Boolean
    },
    discountId: {
        type: String
    },
    readyTimeFrame: {
        type: Number
    }
}, {
    timestamps: true
})

const myOrder = mongoose.model('order', orderSchema)

module.exports = myOrder