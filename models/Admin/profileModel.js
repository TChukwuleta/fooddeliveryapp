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
    }
})

const Profile = mongoose.model('adminProfile', profileSchema)
module.exports = Profile