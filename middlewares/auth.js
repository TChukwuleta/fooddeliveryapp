const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config(); 

const validateAuth = (req, res, next) => {
    const token = req.get('Authorization')
    if(token){
            jwt.verify(token.split(' ')[1], `${process.env.jkeys}`, async (err, decoded) => {
            if(err){
                return false  
            }
            else {
                // console.log(decoded)
                req.user = decoded
                next()
            }
        })
    }
    else{
        return false 
    }
}

module.exports = {
    validateAuth
} 