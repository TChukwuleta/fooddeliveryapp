const mongoose = require('mongoose')
const schema = mongoose.Schema

const profileSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    items: [{
        type: mongoose.Types.ObjectId,
        ref: 'Catalog'
    }]
})

const Profile = mongoose.model('customerProfile', profileSchema)
module.exports = Profile
 