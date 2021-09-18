const express = require('express')
const customerRoute = require('./routes/Customer/customerRoutes')
const userRoute = require('./routes/User/userRoutes')
const adminRoute = require('./routes/Admin/adminRoutes')
const dispathRoute = require('./routes/Dipatcher/dispatchRoute')
const app = express()
const mongoose = require('mongoose')

// mongoose.connect(`${process.env.MONGO_URL}`, { useNewUrlParser: true })
// .then(() => {
//     console.log('Leggo')
// })
// .catch((e) => { 
//     console.log(e)
// })
const uri = 'mongodb://localhost/fooddeliverytest'
mongoose.connect(uri, { useNewUrlParser: true })
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
app.use('/rider', dispathRoute)
app.use('/user', userRoute)

const port = 1001
app.listen(port, () => {
    console.log(`App is ready and on port ${port}`)
})