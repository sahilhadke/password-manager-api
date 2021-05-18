const mongoose = require('mongoose')
const Cryptr = require('cryptr');

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

// Middleware to encrypt password
passwordSchema.pre('save', async function(next){

    const pass = this

    const cryptr = new Cryptr(`${pass.userId}`);

    // only hash the password if it has been modified (or is new)
    if(pass.isModified('password')){
        pass.password = cryptr.encrypt(pass.password);
    }

    // only hash the website if it has been modified (or is new)
    if(pass.isModified('website')){
        pass.website = cryptr.encrypt(pass.website);
    }

    // only hash the username if it has been modified (or is new)
    if(pass.isModified('username')){
        pass.username = cryptr.encrypt(pass.username);
    }

    delete cryptr;

    next()
})

// Get Password List
passwordSchema.statics.getPasswordList = async (userid) => {
    const passlist = await Password.find({userId: userid})
    return passlist;
}

// Decrypt Data
passwordSchema.statics.decryptData = (data, masterKey) => {
    const cryptr = new Cryptr(`${masterKey}`);
    const decryptedData = cryptr.decrypt(data)
    delete cryptr
    return decryptedData
}

// Encrypt Data
passwordSchema.statics.encryptData = (data, masterKey) => {
    const cryptr = new Cryptr(`${masterKey}`);
    const encryptedData = cryptr.encrypt(data)
    delete cryptr
    return encryptedData
}

const Password = mongoose.model('Password', passwordSchema)

module.exports = Password