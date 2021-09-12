const mongoose = require('mongoose')
const schema = mongoose.Schema

const catalogSchema = new schema({
    itemId: {
        type: String
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
    images: {
        type: [String]
    },
    readyTime: {
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

const Catalog = mongoose.model('item', catalogSchema)

module.exports = Catalog