const express = require('express')
const customerRoute = require('./routes/Customer/customerRoutes')
const adminRoute = require('./routes/Admin/adminRoutes')
const app = express()
const mongoose = require('mongoose')


// mongoose.connect(`${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}`, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
//     console.log('Nanana')
// })
// .catch((e) => {
//     console.log(e)
// })
mongoose.connect('mongodb+srv://TChukwuleta:Iamgreat97@cluster1.ejith.mongodb.net/myFoodDelivery?retryWrites=true&w=majority', { useNewUrlParser: true })
.then(() => {
    console.log('Leggo')
})
.catch((e) => {
    console.log(e)
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/customer', customerRoute)
app.use('/admin', adminRoute)

const port = 1001
app.listen(port, () => {
    console.log(`App is ready and on port ${port}`)
})