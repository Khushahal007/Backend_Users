const express=require('express')
const userRoute = require('./Routes/userRoute')
const userModel = require('./Model/userModel')
const dotenv = require("dotenv");
const db=require('./db')
dotenv.config();

const app=express();
app.use(express.json())


const port=process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use('/api', userRoute)

app.listen(port, ()=>{
    console.log("server is running on port 5000")
})