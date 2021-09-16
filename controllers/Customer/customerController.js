const Profile = require('../../models/Customer/profileModel')
const Catalog = require('../../models/productCatalogModel')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Validation schema for the registration
const registerSchema = Joi.object({
    name: Joi.string().required(), 
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    phone: Joi.number(),
    items: Joi.array().items(Joi.string())
})

// Validation schema for the login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
})

// token
const createToken = (id) => {
    return jwt.sign({id},  `${process.env.jkeys}`, {
        expiresIn: 6 * 60 * 60
    })
} 


// PERSONAL PROFILES

// Register customer
const registerCustomer = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const customerExist = await Profile.findOne({ email: req.body.email })
    if (customerExist){
        return res.status(400).json({ "message": "A user with this email already exists" })
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const newCustomer = Profile.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        phone: req.body.phone,
        items: []
    })

    return res.status(201).send( newCustomer )  
}

// Customer login feature
const loginCustomer = async (req, res) => {
    const { error } = loginSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const user = await Profile.findOne({ email: req.body.email })
    if(!user){
        return res.status(400).send('Email does not exist')
    }
    const validatePassword = await bcrypt.compare(req.body.password, user.password)
    if(!validatePassword){
        return res.status(400).send('Password is wrong')
    }
    const token = createToken(user._id)
    return res.status(201).json({ token })
}

// Customer can view their profile
const getCustomerProfile = async (req, res) => { 
    const user = req.user
    if(user) {
        const existingCustomer = await Profile.findById(user.id)
        return res.send(existingCustomer)
    }
    return res.status(400).json({ "message": "Login credential is not available" })
}

// Customer can update their profile
const updateCustomerProfile = async (req, res) => {
    try{
        const user = await Profile.updateOne({ email: req.body.email}, {$set: {
            name: req.body.name,
            password: req.body.password,
            phone: req.body.phone
        }}, { new: true })
        console.log(user)
        res.send(user)
    }
    catch(e){
        console.log(e)
        res.send(e) 
    }
}


// PRODUCT CATALOG

// Customer can add/push items to catalog
const addItems = async (req, res) => {
    const user = req.user
    if(user){
        const { name, description, category, readyTime, price, images } = req.body
        const customer = await Profile.findById(user.id)
        if (customer){
            const createCatalog = Catalog.create({
                itemId: customer._id,
                name,
                description,
                category,
                readyTime,
                price,
                rating: 0
            })
            customer.items.push(createCatalog)
            const result = await customer.save()
            return res.json({ result })
        }
    }
    return res.status(400).json({ "message": "Something went wrong with adding items"})
}

// list of selected customer items (catalog)
const getCatalog = async (req, res) => {
    const user = req.user
    if(user){
        const item = await Catalog.find({ itemId: user.id })
        if(item) {
            return res.json({ item })
        }
    }
    return res.status(400).json({ "message": "Customer's catalog cannot be found"})
}



module.exports = {
    registerCustomer, 
    loginCustomer,
    getCustomerProfile,
    updateCustomerProfile,
    addItems,
    getCatalog
}