const Product = require('../../models/Admin/productModel')
const Joi = require('joi')
const bcrypt = require('bcryptjs')

const productSchema = Joi.object({
    name: Joi.string().required(),
    items: Joi.number().required(),
    price: Joi.number().required(),
    itemNo: Joi.string().required()
})

const registerSchema = Joi.object({
    name: Joi.string().required(), 
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
})

// CREATE ADMIN PROFILE 

const registerAdmin = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const adminExist = await Profile.findOne({ email: req.body.email })
    if (adminExist){
        return res.status(400).json({ "message": "An admin with this email already exists" })
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const newAdmin = Profile.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })

    return res.status(201).json({ newAdmin }) 
}

const loginAdmin = async (req, res) => {
    const { error } = loginSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const admin = await Profile.findOne({ email: req.body.email })
    if(!admin){
        return res.status(400).send('Admin does not exist')
    }
    const validatePassword = await bcrypt.compare(req.body.password, admin.password)
    if(!validatePassword){
        return res.status(400).send('Password is wrong')
    }
    return res.status(201).json({ admin })
}


// CONTENT MANAGEMENT 

const createProduct = async (req, res) => {
    const { error } = productSchema.validate(req.body)
    if (error){
        return res.status(400).send(error.details[0].message)
    }
    const existingProduct = await Product.findOne({ itemNo: req.body.itemNo })
    if(existingProduct){
        return res.json({ "Message": "A Product with that ID exists "})
    }
    const newProduct = await Product.create({
        name: req.body.name,
        items: req.body.items,
        price: req.body.price,
        itemNo: req.body.itemNo
    })
    console.log(newProduct)
    return res.status(201).json({ newProduct })
}

const getProduct = async (req, res) => {
    const productId = req.params.id
    const product = await Product.findOne({ productId })
    if (!product){
        return res.status(400).json({ "message": "No product with that Id exists on our database"})
    }
    return res.status(200).json(product)
}

const getProducts = async (req, res) => { 
    const products = await Product.find({})
    if(!products){
        return res.status(400).json({ "message": "Products data not available" })
    }
    return res.status(200).json(products)
}

const updateProduct = (req, res) => {}

const deleteProduct = (req, res) => {}


module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    registerAdmin,
    loginAdmin
}