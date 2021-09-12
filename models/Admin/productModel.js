const mongoose = require('mongoose')
const schema = mongoose.Schema

const productSchema = new schema({
    name: {
        type: String
    },
    items: {
        type: Number
    },
    price: {
        type: Number
    },
    itemNo: {
        type: String
    }
}, {
    timestamps: true
})

const Product = mongoose.model('product', productSchema)

module.exports = Product