const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config(); 

const validateAuth = (req, res, next) => {
    const token = req.get('Authorization')
    if(token){
        // jwt.verify(token.split(' ')[1], `${process.env.jkeys}`, async (err, decoded) => {
            jwt.verify(token.split(' ')[1], `${process.env.jkeys}`, async (err, decoded) => {
            if(err){
                // console.log(err.message)
                // res.redirect('/')
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
        // res.redirect('/')
        return false 
    }
}

// const ensureAuth = (req, res, next) => {
//     const token = req.cookies.jwt
//     // Check that JSON web token exists and is verified
//     if (token) {
//         jwt.verify(token, `${process.env.jkeys}`, async (err: any, decodedToken: any) => {
//             if (err) {
//                 console.log(err.message)
//                 res.redirect('/login')
//             }
//             else {
//                 console.log(decodedToken)
//                 let user = await User.findById(decodedToken.id)
//                 res.locals.user = user
//                 next()
//             }
//         })
//     }
//     else {
//         res.redirect('/login')
//     }
// }

module.exports = {
    validateAuth
}