const mongoose = require('mongoose')
const schema = mongoose.Schema

const catalogSchema = new schema({
    adminId: {
        type: String
    },
    itemNo: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    deliveryTime: {
        type: Date
    },
    items: {
        type: Number
    },
    price: { 
        type: Number,
        required: true
    },
    rating: {
        type: Number
    }
}, {
    timestamps: true
})

const productCatalog = mongoose.model('productcatalog', catalogSchema)

module.exports = productCatalog
