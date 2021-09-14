const Joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userProfile = require('../../models/User/profileModel')

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
        address: req.body.address
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
            res.status(200).json(profile)
        }
        else{
            return res.status(400).json({ message: "Cant match a profile with the user" })
        }
    }
    return res.status(400).json({ message: "Error with fetching user profile" })
}

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
// Order

// Payment


const testRoute = async(req, res) => {
    const user = req.user
    res.send(user)
}


module.exports = {
    registerCustomer,
    loginCustomer,
    getCustomerProfile,
    updateCustomerProfile,
    testRoute
}