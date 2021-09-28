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
    paidAmount: {
        type: Number
    },
    orderDate: { 
        type: Date
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
    readyTimeFrame: {
        type: Number
    }
}, {
    timestamps: true
})

const myOrder = mongoose.model('order', orderSchema)

module.exports = myOrder