const Joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Discount = require('../../models/discountModel')
const userProfile = require('../../models/userProfileModel')
const Product = require('../../models/productCatalogModel')
const Order = require('../../models/orderModel')
const Transaction = require('../../models/transactionModel')
const adminProfile = require('../../models/adminProfileModel')
const dispatchProfile = require('../../models/dispatchProfileModel')

// Validation schema for the registration      
const registerSchema = Joi.object({
    firstName: Joi.string().required(), 
    lastName: Joi.string().required(), 
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    phone: Joi.number().required(),
    address: Joi.string()
}) 

// Validation schema for the login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
})

// token
const createToken = async (payload) => {
    return jwt.sign(payload, `${process.env.jkeys}`, {
        expiresIn: 6 * 60 * 60
    })
} 

// PROFILE 
// Sign Up
const registerCustomer = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const customerExist = await userProfile.findOne({ email: req.body.email })
    if (customerExist){
        return res.status(400).json({ "message": "A user with this email already exists" })
    }
     
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const result = userProfile.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword, 
        phone: req.body.phone,
        address: req.body.address,
        orders: [],
        lat: 0,
        long: 0
    })
     
    return res.status(201).json({ message: "User created successfully" })
}

// Login
const loginCustomer = async (req, res) => {
    const { error } = loginSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const user = await userProfile.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({"message": "This email is not registered"})
    }
    const confirmPassword = await bcrypt.compare(req.body.password, user.password)
    if(!confirmPassword){
        return res.status(400).json({"message": "You entered an incorrect password"})
    }
    const signature = await createToken({
        _id: user._id, 
        email: user.email
    })
    return res.status(201).json({ signature: signature }) 
}

 

// Profile
const getCustomerProfile = async (req, res) => {
    const user = req.user
    console.log(user)
    if(user){
        const profile = await userProfile.findById(user._id)
        if(profile){
            return res.status(200).json(profile)
        }
        else{
            return res.status(400).json({ message: "Cant match a profile with the user" })
        }
    }
    return res.status(400).json({ message: "Error with fetching user profile" })
}

// Update customer information
const updateCustomerProfile = async (req, res) => {
    const {firstName, lastName, password, phone, address } = req.body
    const user = req.user
    if(user){
        const profile = await userProfile.findById(user._id)
        if(profile){
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            profile.firstName = firstName,
            profile.lastName = lastName,
            profile.password = hashPassword,
            profile.phone = phone,
            profile.address = address

            const result = await profile.save()
            return res.status(200).json(result)
        }
    }
    return res.status(400).json({ message: "Error with updating user" })
}


// CART

const addToCart = async(req, res) => {
    const user = req.user
    console.log(user)
    if(user){
        const profile = await userProfile.findById(user._id).populate("cart.product")
        let cartItems = Array()
        const { id, unit } = req.body
        const product = await Product.findById(id)
        // console.log(profile)
        // console.log(id)
        // console.log(product)
        if(product){
            if(profile){
                cartItems = profile.cart
                if(cartItems.length > 0){
                    // Check and update unit
                    let existsFoodItem = cartItems.filter((item) => item.product._id.toString() === id)
                    if(existsFoodItem.length > 0){
                        const index = cartItems.indexOf(existsFoodItem[0])
                        if(unit > 0){
                            cartItems[index] = { product, unit }
                        }
                        else{
                            cartItems.splice(index, 1)
                        }
                    } 
                    else{
                        cartItems.push({ product, unit })
                    }
                }
                else{
                    // add new item to cart
                    cartItems.push({ product, unit })
                }
                if(cartItems){
                    profile.cart = cartItems
                    const cartResult = await profile.save()
                    return res.status(200).json(cartResult.cart)
                }
            }
            return res.status(400).json({ message: "Profile not found" })
        }
        return res.status(400).json({ message: "Product not found" })
    }  
    return res.status(400).json({ message: "Unable to create cart" })
}

const getCart = async(req, res) => {
    const user = req.user
    if (user){
        const profile = await userProfile.findById(user._id).populate('cart.product')
        if(profile){
            return res.status(200).json(profile.cart)
        }
    }
    return res.status(400).json({ message: "Cart is empty" })
}

const deleteCart = async(req, res) => {
    const user = req.user
    if (user){
        const profile = await userProfile.findById(user._id).populate('cart.product')
        if(profile){
            profile.cart = []
            const cartResult = await profile.save()
            return res.status(200).json(cartResult)
        }
    }
    return res.status(400).json({ message: "Cart is already empty" })
}


// Discount
const getAvailableDiscount = async (req, res) => {
    const pincode = req.params.pincode
    const discounts = await Discount.find({ pincode, isActive: true })
    if(discounts){
        return res.status(200).json(discounts)
    }
    return res.status(400).json({ message: "Discount not found" })
}

const verifyDiscount = async (req, res) => {
    const offerId = req.params.id
    const user = req.user
    if(user){
        const appliedDiscount = await Discount.findById(offerId)
        if(appliedDiscount){
            if(appliedDiscount.isActive){
                return res.status(200).json({ message: "Discount is valid", discount: appliedDiscount })
            }
        }
    }
    return res.status(400).json({ message: "Discount is not valid" })
}



// Payment
const createPayment = async (req, res) => {
    const user = req.user
    const { amount, paymentMode, discountId } = req.body 
    let payableAmount = Number(amount)
    if(discountId){
        const appliedDiscount = await Discount.findById(discountId)
        if (appliedDiscount){
            if(appliedDiscount.isActive){
                payableAmount = (payableAmount - appliedDiscount.discountAmount)
            }
        }
    }
    // Perform payment gateway charge API call
    router.post('/transfer', (req, res, next) => {
        const reference = "trans-"+ Date.now()
        const seckey = `${process.env.Secret_Key}`
        const account_bank = req.body.bankcode
        const account_number = req.body.accountno
        const amount = req.body.amount
    
        // console.log(reference)
        var options = {
            method: 'POST',
            url: 'https://ravesandboxapi.flutterwave.com/v2/gpx/transfers/create',
            form: { account_bank:account_bank, account_number:account_number, amount:amount, seckey:seckey, reference:reference },
            headers: { 'content-type': 'application/json' }
        }
        request(options, (error, response, body) => {
            if(error){
                return res.status(400).json(error)
            }
    
            const resp = JSON.parse(body)
            console.log(resp)
            return res.status(200).json(resp)
        })
    }) 
    
    // Create record on transaction
    const transaction = await Transaction.create({
        customer: user._id,
        adminId: '',
        orderId: '',
        orderValue: payableAmount,
        discountUsed: discountId || 'NA',
        status: 'OPEN',
        paymentMode,
        PaymentResponse: "Another Banger.. Woo.. Cash or nothing"
    })
    return res.status(201).json(transaction)
}


// Validate Transactions
const validateTransaction = async (txnId) => {
    const currentTransaction = await Transaction.findById(txnId)
    if(currentTransaction){
        if(currentTransaction.status.toLowerCase() !== "failed"){
            return { status: true, currentTransaction }
        }
    }
    return { status: false, currentTransaction }
}





// DELIVERY

const assignOrderForDelivery = async (orderId, adminId) => {
    const admin = await adminProfile.findById(adminId)
    if(admin){
        const areacode = admin.pincode
        const adminlat = admin.lat
        const adminlng = admin.lng

        const rider = await dispatchProfile.find({ dCode: areacode, serviceAvailable: true })
        if(rider){
            // Check the nearest rider
            console.log(`Delivery Person ${rider[0]}`)
            const currentOrder = await Order.findById(orderId)
            if(currentOrder){
                // Update deliveryId
                currentOrder.deliveryId = order[0]._id
                const response = await currentOrder.save()
                console.log(response)

                // Notification using firebase notification
            }
        }
    }
}



// ORDERS

const createOrder = async (req, res) => {
    const user = req.user
    const { txnId, amount, items } = req.body
    if(user){
        const { status, currentTransaction } = await validateTransaction(txnId)
        if(!status){
            return res.status(400).json({ message: "Error with creating order" })
        }
        
        // Create an order ID
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`
        const customer = await userProfile.findById(user._id)
        // res.send(customer)

        // Grab order items from request
        // const cart = req.body 
        let cartItems = [] 
        let netAmount = 0.0

        // Calculate order amount
        const products = await Product.find().where('_id').in(items.map(itemss => itemss._id)).exec()
        products.map(product => {
            items.map(({ _id, unit }) => {
                if(product._id == _id){
                    adminId = product.adminId
                    netAmount += (product.price * unit)
                    cartItems.push({ product, unit })
                }
            })
        })
        // Create order with item description 
        if(cartItems){
            const currentOrder = await Order.create({
                adminId: adminId,
                orderId: orderId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: 'Waiting',
                remarks: '',
                deliveryId: '',
                readyTimeFrame: 45
            })
            if(currentOrder){
                customer.cart = []
                customer.orders.push(currentOrder)

                currentTransaction.adminId = adminId
                currentTransaction.orderId = orderId
                currentTransaction.status = "Confirmed"

                await currentTransaction.save()
                assignOrderForDelivery(currentOrder._id, adminId)

                const profileResponse = await customer.save()
                console.log(currentOrder)
                return res.status(200).json(profileResponse)
            }
        }
    }
    
    return res.status(400).json({ message: "Error with creating orders"})
}

const getOrders = async (req, res) => {
    const user = req.user
    if(user){
        const profile = await userProfile.findById(user._id).populate("orders")
        if(profile){
            return res.status(200).json(profile.orders)
        }
    }
    return res.status(400).json({ message: "No Order available" })
}

const getOrderById = async (req, res) => {
    const orderId = req.params.id
    if(orderId){
        const order = await Order.findById(orderId).populate("items.item")
        res.status(200).json(order)
    }
}


const testRoute = async(req, res) => {
    const user = req.user
    res.send(user)
}


module.exports = {
    registerCustomer,
    loginCustomer,
    getCustomerProfile,
    updateCustomerProfile,
    getCart,
    addToCart,
    deleteCart,
    createOrder,
    getOrders,
    getOrderById,
    testRoute,
    getAvailableDiscount,
    verifyDiscount,
    createPayment
}