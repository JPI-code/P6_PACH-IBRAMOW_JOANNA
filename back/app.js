const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const userRoutes= require("./routes/userRoutes")

//CONNECTING TO DATABASE
mongoose.connect("mongodb://localhost:27017/test",
{useNewUrlParser:true})
.then (()=> console.log("connected to database"))
.catch (() => console.error("Error in database connection"))




app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  })


app.use(bodyParser.json());
//setting up API
app.use("/api/auth", userRoutes)

module.exports = app;