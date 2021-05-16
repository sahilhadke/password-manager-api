const Password = require('../models/password')
require('../database/mongoose')
const auth = require('../middleware/auth')
const express = require('express')

const router = express.Router()

// Get all passwords of the user
router.get('/passwords/all', auth, async (req, res) => {
    try{
        const passwords = await Password.find({userId: req.user._id})
        res.status(200).send(passwords)
    }catch(e){
        res.status(400).send(e)
    }
    
})

// Get specific website password of the user
router.get('/passwords', auth, async (req, res) => {
    console.log('this ran')
    try{
        console.log(req.params)
        const passwords = await Password.find({userId: req.user._id, website: req.query.website})
        res.status(200).send(passwords)
    }catch(e){
        res.status(400).send(e)
    }
    
})

// Add Password
router.post('/passwords/add', auth, async (req, res) => {
    try{
        const newPassword = new Password({
            website: req.body.website,
            username: req.body.username,
            password: req.body.password,
            userId: req.user._id
        })
    
        await newPassword.save()
        res.status(200).send(newPassword)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

// Update Tasks
router.patch('/passwords/update', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'password', 'website']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(404).send('not a valid operation')
    }

    try{

        const pass = await Password.findOne({
            website: req.query.website,
            userId: req.user._id
        })

        if(pass){

            updates.forEach((update)=>{
                pass[update] = req.body[update]
            })
    
            await pass.save()

            res.status(200).send(pass)

        }else{

            res.status(404).send('no pass found')

        }
        
    }catch(e){

        console.log(e)
        res.status(400).send(e)

    }

})

// Delete Password
router.delete('/passwords', auth, async (req, res) => {
    try{
        const pass = await Password.findOne({
            ...req.body,
            userId: req.user._id        
        })

        if(!pass){
            res.status(404).send('pass not found')
        }else{
            await Password.findByIdAndDelete(pass._id)
            res.status(200).send(pass)
        }
    }catch(e){
        res.status(400).send(e)
    }
})

// Delete Password All
router.delete('/passwords/all', auth, async (req, res) => {
    try{
        const pass = await Password.find({  
            userId: req.user._id 
        })

        if(!pass){
            res.status(404).send('pass not found')
        }else{
            await Password.deleteMany({
                userId: req.user._id 
            })
            res.status(200).send(pass)
        }
    }catch(e){
        res.status(400).send(e)
    }
})

// Dev (Show all Passwords)
router.get('/dev/passwords', async (req, res) => {
    
    try{
        const pass = await Password.find({})
        res.status(200).send(pass)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
    
})

module.exports = router