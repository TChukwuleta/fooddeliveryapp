const mongoose = require('mongoose')
const schema = mongoose.Schema

const transactionSchema = new schema({
    customer: {
        type: String
    },
    adminId: {
        type: String
    },
    orderId: {
        type: String
    },
    orderValue: {
        type: Number
    },
    discountUsed: {
        type: String
    },
    status: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    paymentResponse: {
        type: String
    }
})

const Transaction = mongoose.model('transaction', transactionSchema)

module.exports = Transaction