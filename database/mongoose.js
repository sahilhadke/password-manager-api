const mongoose = require('mongoose')
const validator = require('validator')
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(`mongodb+srv://sahilhadke:${process.env.MONGO_PASS}@cluster0.lupxc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})