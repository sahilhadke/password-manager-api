const jwt = require('jsonwebtoken')
const Users = require('../models/user')

const auth = async (req, res, next) => {

    try{

        console.log('Header', req.header('Authorization'))

        const token = req.header('Authorization').replace('Bearer ', '')      
        
        console.log('Header', req.header)
        
        const decoded = jwt.verify(token, `${process.env.AUTH_TOKEN}`)

        const user = await Users.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user

        next()
    }catch (e){
        console.log('💁 No auth')
        res.status(401).send({success: 0, error:"Authentication Failed"})
    }   
    
}

module.exports = auth