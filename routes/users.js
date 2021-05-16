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

        res.status(200).send({user: user, token: token})
    }catch(e){
        console.log(e)
        res.send('error')
    }
})

// User Login
router.post('/user/login', async (req, res) => {
    try{
        const user = await User.findByCreds(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user: user, token: token })
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

// Get Current User Profile
router.get('/user/me', auth, async (req, res) => {

    try{
        res.send(req.user)
        
    }catch(e){
        res.status(500).send()
    }
})

// Update Profile
router.patch('/user/me/edit', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    console.log('Updates: ', updates)    

    console.log('Type of Updates: ', typeof(updates))    
    const allowedUpdates = ['name', 'password', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(404).send('not a valid operation')
    }

    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        
        res.status(200).send(req.user)     

    }catch(e){

        console.log(e)
        res.status(400).send(e)
        
    }
})

// Delete Profile
router.delete('/user/me/delete', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        console.log(e)
        res.status(500).send('something went wrong')
    }
})

// Logout
router.post('/user/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return (token.token != req.token)
        })

        await req.user.save()

        res.send()
    }catch (e){
        res.status(500).send(e)
    }
})

// Dev (Show all Users)
router.get('/dev/users', async (req, res) => {
    
    try{
        const users = await User.find({})
        res.status(200).send(users)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
    
})

module.exports = router