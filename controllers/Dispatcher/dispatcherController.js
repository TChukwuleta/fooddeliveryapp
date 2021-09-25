const dispatchProfile = require('../../models/dispatchProfileModel')
const Admin = require('../../models/adminProfileModel')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const adminProfile = require('../../models/adminProfileModel')

// Register Validation schema
const registerSchema = Joi.object({
    firstName: Joi.string().required(), 
    lastName: Joi.string().required(), 
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    phone: Joi.string().required(),
    address: Joi.string().required(), 
    pincode: Joi.string().required()
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
    if(user){
        const admin = await adminProfile.findById(user._id)
        console.log(admin)
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
            const genId = Math.floor((Math.random() * 1000000) + 1)
            const newRider = await dispatchProfile.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                dCode: genId,
                lat: 0,
                lng: 0,
                email: req.body.email,
                password: hashPassword,
                phone: req.body.phone   
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

// Get rider's profile
const getdispatcherProfile = async (req, res) => {
    const rider = req.user
    if(rider){
        const profile = await dispatchProfile.findById(rider._id)
        if(profile){
            return res.status(200).json(profile)
        }
    }
    return res.status(400).json({ message: "Error with fetching Rider" })
}


// Update Rider's profile
const updateDispatchProfile = async (req, res) => {
    const rider = req.params.dCode
    if(rider){
        const profile = await dispatchProfile.find({ dCode: rider })
        if(profile){
            profile.firstName = req.body.firstName,
            profile.lastName = req.body.lastName,
            profile.email = req.body.email,
            profile.phone = req.body.phone

            const savedResult = await profile.save()
            return res.status(200).json(savedResult)
        }
    }
    return res.status(400).json({ message: "Cannot get Rider" }) 
}



// Rider's availability
const dispatchAvailability = async (req, res) => {
    const pinCode = req.params.pincode
    const result = await dispatchProfile.find({ dCode: pinCode })
 
    if(result){ 
        dispatchProfile.serviceAvailable = true
        const toggler =  dispatchProfile.save()
        return res.status(200).json(toggler) 
    } 
    else{
        res.status(400).json({ "message": "Rider not found" })
    }
}

const updateServiceAvalilability = async (req, res) => {
    const user = req.user
    console.log(user)
    if(user){
        const { lat, lng } = req.body
        const existingRider = await dispatchProfile.findById(user._id)
        if(existingRider){
            if(lat && lng){
                existingRider.lat = lat
                existingRider.lng = lng
            }
            existingRider.serviceAvailable = !existingRider.serviceAvailable
            const savedResult = await existingRider.save()
            return res.json(savedResult)
        }
    }
    return res.status(200).json({ message: "Error with updating availability status" })
}

const requestResponse = async (req, res) => {
    const user = req.user
    console.log(user)
    if(user){
        const existingRider = await dispatchProfile.findById(user._id)
        if(existingRider){
            existingRider.wantsToRide = !existingRider.wantsToRide
            const savedResult = await existingRider.save()
            return res.json(savedResult)
        }
    }
    return res.status(200).json({ message: "Error with updating availability status" })
}



module.exports = {
    registerRider,
    loginRider,
    dispatchAvailability,
    getdispatcherProfile,
    updateDispatchProfile,
    updateServiceAvalilability,
    requestResponse
}