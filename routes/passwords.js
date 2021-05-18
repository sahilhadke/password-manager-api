const Password = require('../models/password')
require('../database/mongoose')
const auth = require('../middleware/auth')
const express = require('express')

const router = express.Router()

// Get all passwords of the user
router.get('/passwords/all', auth, async (req, res) => {
    try{
        const passlist = await Password.getPasswordList(req.user._id)
        const newList = []
        // Decrypts Data
        passlist.map( (pass) => {
            pass.website = Password.decryptData(pass.website, pass.userId)
            pass.username = Password.decryptData(pass.username, pass.userId)
            pass.password = Password.decryptData(pass.password, pass.userId)

            const newPass = {
                _id: pass._id,
                website: pass.website,
                username: pass.username,
                password: pass.password
            }
            newList.push(newPass)
        })
            res.status(200).send(newList)
    }catch(e){

        console.log(e)
        res.status(400).send({success: 0, error: "Something went wrong :("})
    }
    
})

// Get specific website password of the user
router.get('/passwords', auth, async (req, res) => {
    try{
        const password = await Password.findOne({_id: req.query._id})
        const passToSend = {
            website: Password.decryptData(password.website, password.userId),
            username: Password.decryptData(password.username, password.userId),
            password: Password.decryptData(password.password, password.userId)
        }
        res.status(200).send(passToSend)
    }catch(e){
        console.log(e)
        res.status(400).send({success: 0, error: "Something went wrong :("})
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
        res.status(200).send({success: 1})
    }catch(e){
        console.log(e)
        res.status(400).send({success: 0, error: "Something went wrong :("})
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
            _id: req.query._id,
            userId: req.user._id
        })

        if(pass){

            updates.forEach((update)=>{
                // no need to encrypt because the middleware will do it
                pass[update] = req.body[update]
            })
    
            await pass.save()

            res.status(200).send({success: 1})

        }else{

            res.status(404).send('no pass found')

        }
        
    }catch(e){

        console.log(e)
        res.status(400).send({success: 0, error: "Something went wrong :("})

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
            res.status(404).send({success: 0, error: "Password Not Found!"})
        }else{
            await Password.findByIdAndDelete(pass._id)
            res.status(200).send({success: 1})
        }
    }catch(e){
        console.log(e)
        res.status(400).send({success: 0, error: "Something went wrong :("})
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
            res.status(200).send({success: 1})
        }
    }catch(e){
        res.status(400).send({success: 0, error: "Something went wrong :("})
    }
})

module.exports = router