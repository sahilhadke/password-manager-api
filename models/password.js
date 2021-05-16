const mongoose = require('mongoose')

const passwordSchema = new mongoose.Schema({
    website:{
        type: String,
        require: true,
        trim: true
    },
    username:{
        type: String,
        require: true,
        trim: true
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
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Password = mongoose.model('Password', passwordSchema)

module.exports = Password