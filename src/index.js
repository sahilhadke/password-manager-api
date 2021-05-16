const express = require('express')
const userRouter = require('../routes/users')
const passwordRouter = require('../routes/passwords')
const dotenv = require('dotenv');
dotenv.config();

const app = express()
const port = process.env.PORT

app.use(express.json()) // parses the body
app.use(userRouter)
app.use(passwordRouter)

app.listen(port, ()=>{
    console.log(`Server is live on port ${port}`)
})