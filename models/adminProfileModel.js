const mongoose = require('mongoose')
const schema = mongoose.Schema

const profileSchema = new schema({  
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: { 
        type: String
    },
    pincode: {
        type: String
    },
    phone: {
        type: String
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    couriersId: [{
        type: schema.Types.ObjectId,
        ref: 'dispatchprofile'
    }],   
    products: [{  
        type: schema.Types.ObjectId,
        ref: 'productcatalog'
    }]
}, {
    timestamps: true
})

const adminProfile = mongoose.model('adminProfile', profileSchema)
module.exports = adminProfile