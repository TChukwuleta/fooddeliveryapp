const Joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { generateOTP } = require('../../utility/notificationUtility')
const userProfile = require('../../models/User/profileModel')

// Validation schema for the registration
const registerSchema = Joi.object({
    firstName: Joi.string().required(), 
    lastName: Joi.string().required(), 
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    phone: Joi.number().required(),
    address: Joi.string(),
    verified: Joi.boolean().required(),
    otp: Joi.number().required(),
    otp_expiry: Joi.date().required(),
    lat: Joi.number(),
    lng: Joi.number()
})

// token
const createToken = (id) => {
    return jwt.sign({id},  `${process.env.jkeys}`, {
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
    const { otp, expiry } = generateOTP()
    console.log(otp, expiry)
    return res.send('working...')
    const result = Profile.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        phone: req.body.phone,
        address: req.body.address,
        verified: false,
        otp,
        otp_expiry: expiry,
        lat: 0,
        lng: 0
    })
    
    if(result){
        // Send the OTP to the user
        // generate the signature
        //send the result to the client
    }

    return res.status(201).send( newCustomer )  
}

// Login
const loginCustomer = (req, res) => {}

// Verify user account
const verifyCustomer = (req, res) => {}

// OTP / Requesting OTP
const requestOTP = (req, res) => {}

// Profile
const getCustomerProfile = (req, res) => {}
const updateCustomerProfile = (req, res) => {}


// CART
// Order

// Payment



module.exports = {
    registerCustomer,
    loginCustomer,
    verifyCustomer,
    requestOTP,
    getCustomerProfile,
    updateCustomerProfile
}