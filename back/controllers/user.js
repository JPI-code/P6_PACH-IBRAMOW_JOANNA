//EXTRACTING USER MODEL FROM USER.JS

const User = require("../models/User.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


// FUNCTION SIGNUP
//resquest - question from loginpage; response ios an answer to POST 
exports.signUp = (request, response) => {
    // "10" is a value  for STRONG password
    bcrypt.hash(request.body.password, 10) 
    .then (hashedPassword =>  {
        const user = new User ( {
            email: request.body.email,
            password: hashedPassword,
        })
        user.save()
        .then (() => {
            response.status (201).json({
              message: "succes" 
            })
        })
    })
    .catch(error => {
        response.status(400).json({
            error
        })
    }) 
}




// FUNCTION LOGIN
exports.login= (request, response) => {
    //check if user already exists
    User.findOne({
        email: request.body.email,
    })
    .then (user => {
        if (!user){
            response.status(401).json({
                message: "User doesn't exist or Email incorrect"
            })
        }
    bcrypt.compare(request.body.password, user.password) 
    .then (validpassword => {
        if (!validpassword)
        { response.status(401).json({
            message: "Invalid Password"
        })
        }
        const token = jwt.sign (
            {email: user.email, userId: user._id},
            "randomTokenSecret",
            {expiresIn: "2h"}
        )
        response.status(200).json({
            token, 
            userId: user._id,
        })
    })
    .catch (error => {
        response.status(500).json({
            error
        })
    })
        
    })
    .catch (error => {
        response.status(500).json({
            error
        })
    })
}
