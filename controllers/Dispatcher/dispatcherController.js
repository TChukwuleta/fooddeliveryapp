const dispatchProfile = require('../../models/dispatchProfileModel')
const Admin = require('../../models/adminProfileModel')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const adminProfile = require('../../models/adminProfileModel')

// Register Validation schema
const registerSchema = Joi.object({
    name: Joi.string().required(), 
    dCode: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    phone: Joi.string().required()
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

// CREATE RIDER PROFILE 
// Create rider's account
const registerRider = async (req, res) => {
    const user = req.user
    if (user){
        const admin = await adminProfile.findById(user._id)
        if(admin){
            const { error } = registerSchema.validate(req.body)
            if (error) {
                return res.status(400).send(error.details[0].message)
            }
            const riderExist = await dispatchProfile.findOne({ email: req.body.email })
            if (riderExist){
                return res.status(400).json({ "message": "A Rider with this email already exist" })
            }
            
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            const newRider = await dispatchProfile.create({
                name: req.body.name,
                dCode: req.body.dCode,
                email: req.body.email,
                password: hashPassword,
                phone: req.body.phone,
                serviceAvailable: false,
                wantsToRide: false
            })
            console.log(newRider)
            admin.couriersId.push(newRider)
            const result = admin.save()
            return res.json(result) 
        }
    }
}
 
// Login into rider's accouunt
const loginRider = async (req, res) => {
    const { error } = loginSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const rider = await dispatchProfile.findOne({ email: req.body.email })
    if(!rider){
        return res.status(400).send('Rider does not exist')
    }
    const validatePassword = await bcrypt.compare(req.body.password, rider.password)
    if(!validatePassword){
        return res.status(400).send('Password is wrong')
    }
    const signature = await createToken({
        _id: rider._id, 
        email: rider.email
    })
    return res.status(201).json({ signature: signature }) 
}

// Rider's availability
const dispatchAvailability = async (req, res) => {
    const pinCode = req.params.pincode
    const result = await dispatchProfile.find({ dCode: pinCode })
 
    if(result){ 
        const Moving = dispatchProfile.serviceAvailable
    }
    else{
        res.status(400).json({ "message": "Rider not found" })
    }
}

const register = (req, res) => {}
 
const login = (req, res) => {}

const getdispatcherProfile = (req, res) => {}

const updateDispatchProfile = (req, res) => {}


module.exports = {
    registerRider,
    loginRider,
    dispatchAvailability,
    register,
    login,
    getdispatcherProfile,
    updateDispatchProfile
}