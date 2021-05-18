const User = require('../models/user')
require('../database/mongoose')
const auth = require('../middleware/auth')
const express = require('express')

const router = express.Router()

// User Register
router.post('/user/register', async (req, res) => {
    const user = new User(req.body)
    // res.send(user)
    try{
        await user.save()
        const token = await user.generateAuthToken()

        res.status(200).send({name: user.name, email: user.email, token: token })
    }catch(e){
        console.log(e)
        res.status(400).send({success: 0, error: "Something went wrong :("})
    }
})

// User Login
router.post('/user/login', async (req, res) => {
    try{
        const user = await User.findByCreds(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
       

        res.send({name: user.name, email: user.email, token: token })
    }catch(e){
        console.log(e)
        res.status(400).send({success: 0, error: "Something went wrong :("})
    }
})

// Get Current User Profile
router.get('/user/me', auth, async (req, res) => {

    try{
        const userToSend = {
            name: req.user.name, 
            email: req.user.email
        }
        res.send(userToSend)
        
    }catch(e){
        console.log(e)
        res.status(500).send({success: 0, error: "Something went wrong :("})
    }
})

// Update Profile
router.patch('/user/me/edit', auth, async (req, res) => {

    const updates = Object.keys(req.body)  
    const allowedUpdates = ['name', 'password', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(404).send({success: 0, error: "Not a valid operation."})
    }

    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        
        res.status(200).send({success: 1})     

    }catch(e){

        console.log(e)
        res.status(400).send({success: 0, error: "Something went wrong :("})
        
    }
})


// Delete Profile
router.delete('/user/me/delete', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send({success: 1})
    }catch(e){
        console.log(e)
        res.status(500).send({success: 0, error: "Something went wrong :("})
    }
})

// Logout
router.post('/user/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return (token.token != req.token)
        })

        await req.user.save()

        res.send({success: 1})
    }catch (e){
        res.status(500).send(e)
    }
})

module.exports = router