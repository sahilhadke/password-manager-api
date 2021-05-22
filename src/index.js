const express = require('express')
const cors = require('cors');
const userRouter = require('../routes/users')
const passwordRouter = require('../routes/passwords')
const dotenv = require('dotenv');
dotenv.config();

const app = express()
const port = process.env.PORT || 3030

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE");
    next();
  });

app.use(express.json()) // parses the body
app.use(userRouter)
app.use(passwordRouter)

app.listen(port, ()=>{
    console.log(`Server is live on port ${port}`)
})