const Product = require('../../models/productCatalogModel')
const adminProfile = require('../../models/adminProfileModel')
const Discount = require('../../models/discountModel')
const Transaction = require('../../models/transactionModel')
const Order = require('../../models/orderModel')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dispatchProfile = require('../../models/dispatchProfileModel')

// Product Validation schema
const productSchema = Joi.object({
    itemNo: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    items: Joi.number().required(),
    price: Joi.number().required()
})

// Register Validation schema
const registerSchema = Joi.object({
    name: Joi.string().required(), 
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    phone: Joi.string().required(), 
})

// login Validation schema
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

// CREATE ADMIN PROFILE 
const registerAdmin = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const adminExist = await adminProfile.findOne({ email: req.body.email })
    if (adminExist){
        return res.status(400).json({ "message": "An admin with this email already exists" })
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const newAdmin = await adminProfile.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        phone: req.body.phone,
        pincode: req.body.pincode,
        couriersId: [],
        products: [],
        lat: 0,
        lng: 0
    })

    return res.status(201).json({ message: "Admin Account created successfully" }) 
}

// Login into admin accouunt
const loginAdmin = async (req, res) => {
    const { error } = loginSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const admin = await adminProfile.findOne({ email: req.body.email })
    if(!admin){
        return res.status(400).send('Admin does not exist')
    }
    const validatePassword = await bcrypt.compare(req.body.password, admin.password)
    if(!validatePassword){
        return res.status(400).send('Password is wrong')
    }
    const signature = await createToken({
        _id: admin._id, 
        email: admin.email
    })
    return res.status(201).json({ signature: signature }) 
}



// CONTENT MANAGEMENT 
// Create new product/Item
const createProduct = async (req, res) => {
    const user = req.user
    if(user){
        const admin = await adminProfile.findById(user._id)  
        if(admin){
            const { error } = productSchema.validate(req.body)
            if (error){
                return res.status(400).send(error.details[0].message)
            }
            const existingProduct = await Product.findOne({ itemNo: req.body.itemNo })
            if(existingProduct){
                return res.json({ "Message": "A Product with that ID exists "})
            }
            const newProduct = await Product.create({
                adminId: admin._id,
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                items: req.body.items,
                price: req.body.price,
                itemNo: req.body.itemNo,
                deliveryTime: new Date(),
                rating: 0
            })
            console.log(newProduct)
            // return res.status(201).json(newProduct)
            admin.products.push(newProduct)
            const result = admin.save() 
            return res.json(result)
        }
        return res.status(400).json({ message: "Only Admins can create product"})
    }
} 

// Get a single product/Item
const getProduct = async (req, res) => {
    const productId = req.params.id
    const product = await Product.findById(productId)
    if (!product){
        return res.status(400).json({ "message": "No product with that Id exists on our database"})
    }
    return res.status(200).json(product)
}

// Get all products/items
const getProducts = async (req, res) => { 
    const products = await Product.find({})
    if(!products){
        return res.status(400).json({ "message": "Products data not available" })
    }
    return res.status(200).json(products)
}

// Update a product/item
const updateProduct = async (req, res) => {
    const user = req.user
    const productId = req.params.id
    if(user){
        const admin = await adminProfile.findById(user._id)
        if(admin){
            const product = await Product.findById(productId)
            if(product){
                product.name = req.body.name,
                product.description = req.body.description,
                product.category = req.body.category,
                product.items = req.body.items
                product.price = req.body.price

                const savedResult = await product.save()
                return res.status(201).json(savedResult)
            }
            return res.status(400).json({ message: "No product with that ID exists" })
        }
        return res.status(400).json({ message: "Only Admins can update products" })
    }
}

const deleteProduct = (req, res) => {}


// Orders
const getCurrentOrders = async (req, res) => {
    const admin = req.user
    if(admin){
        const orders = await Order.find({ adminId: admin._id}).populate('items.item')
        if(orders){
            return res.status(200).json(orders)
        }
    }
    return res.status(400).json({ message: "Order not found" })
}

const getOrderDetail = async (req, res) => {
    const orderId = req.params.id
    if(orderId){
        const order = await Order.findById(orderId).populate('items.item')
        if(order){
            return res.status(200).json(order)
        }
    }
    return res.json({ message: "Order not found" })
}

const processOrder = async (req, res) => {
    const orderId = req.params.id
    // Status => Accept, Waiting, Reject, Under-process, Ready, failed
    const { status, remarks, time } = req.body
    if(orderId){
        const order = await Order.findById(orderId).populate('items.item')
        order.orderStatus = status
        order.remarks = remarks
        if(time){
            order.readyTimeFrame = time
        }
        const orderResult = await order.save()
        if(orderResult){
            return res.status(200).json(orderResult)
        }
    }
    return res.json({ message: "Unable to process Order" })
}


// DISCOUNTS

const getDiscounts = async (req, res) => {
    let currentDiscount = []
    const user = req.user
    if(user){
        const discounts = await Discount.find().populate('theAdmin')
        if(discounts){
            discounts.map(item => {
                if(item.theAdmin){
                    item.theAdmin.map(admin => {
                        if(admin._id.toString() === user._id){
                            currentDiscount.push(item)
                        }
                    })
                }
            })
        }
        return res.status(200).json(currentDiscount)
    }
    return res.status(400).json({ message: "Discount not available" })
}

const createDiscount = async (req, res) => {
    const user = req.user
    if(user){
        const { title, description, discountAmount, pincode,
        promocode, startValidity, endValidity, bank, bins,
        minValue, isActive } = req.body

        const admin = await adminProfile.findById(user._id)
        if(admin){
            const discount = await Discount.create({
                title,
                description,
                discountAmount,
                pincode,
                promocode,
                startValidity,
                endValidity,
                bank,
                bins,
                isActive,
                minValue, 
                theAdmin: [admin]
            })
            console.log(discount)
            return res.status(201).json(discount)
        }
    }
    return res.status(400).json({ message: "Unable to add Discount" })
}

const editDiscount = async (req, res) => {
    const discountId = req.params.id
    const user = req.user
    if (user){
        const { title, description, discountType, discountAmount, pincode,
            promocode, promotype, startValidity, endValidity, bank, bins,
            minValue, isActive 
        } = req.body
        const currentDiscount = await Discount.findById(discountId)
        if(currentDiscount){
            const admin = await adminProfile.findById(user._id)
            if(admin){   
                currentDiscount.title = title,
                currentDiscount.description = description,
                currentDiscount.discountType = discountType,
                currentDiscount.discountAmount = discountAmount,
                currentDiscount.pincode = pincode,
                currentDiscount.promocode = promocode,
                currentDiscount.startValidity = startValidity,
                currentDiscount.endValidity = endValidity,
                currentDiscount.bank = bank,
                currentDiscount.bins = bins,
                currentDiscount.isActive = isActive,
                currentDiscount.minValue = minValue

                const result = await currentDiscount.save()
                return res.status(201).json(result)
            }
        }
    }
    return res.status(400).json({ message: "Can't get discount" })
}

const getTransaction = async (req, res) => {
    const transactions = await Transaction.find()
    if(transactions){
        return res.status(200).json(transactions)
    }
    return res.status(400).json({ message: "Transactions not available" })
}

const getTransactionById = async (req, res) => {
    const id = req.params.id
    const transaction = await Transaction.findById(id)
    if(transaction){
        return res.status(200).json(transaction)
    }
    return res.status(400).json({ message: "Transaction receipt not found" })
}

// const verifyRider = async (req, res) => {
//     const { _id, status } = req.body
//     if(_id){
//         const profile = await dispatchProfile.findById(_id)
//         if(profile){
//             profile.verified = status
//             const result = await profile.save()
//             return res.status(200).json(result)
//         }
//     }
//     return res.status(400).json({ message: "Rider not found" })
// }

// const GetRiders = async (req, res) => {
//         const riders = await dispatchProfile.find()
//         if(riders){
//             return res.status(200).json(riders)
//         }
//     return res.status(400).json({ message: "Riders not found" })
// }



module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    registerAdmin,
    loginAdmin,
    getOrderDetail,
    getCurrentOrders,
    processOrder,
    getDiscounts,
    editDiscount,
    createDiscount,
    getTransaction,
    getTransactionById
}