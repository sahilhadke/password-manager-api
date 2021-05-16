const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('Password is password')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }        
    }]
}, {
    timestamps: true
})

userSchema.virtual('passwords', {
    ref: 'Password',
    localField: '_id',
    foreignField: 'userId'
})

// Middleware to encrypt password
userSchema.pre('save', async function(next){

    const user = this

    // only hash the password if it has been modified (or is new)
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
        console.log('password hashed!')
    }

    next()
})

// Generate Auth Token and save it in user db
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, `${process.env.AUTH_TOKEN}`)

    user.tokens = user.tokens.concat({token: token})
    await user.save()

    return token
}

// User Login: Serach User in DB
userSchema.statics.findByCreds = async (email, password) => {

    const user = await User.findOne({email: email})

    if(!user){
        // wrong email
        throw new Error('Unable to login')

    }else{

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            // wrong password but registerd email
            throw new Error('Unable to login')
        }else{
            return user
        }
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User