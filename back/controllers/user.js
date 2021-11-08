//EXTRACTING USER MODEL FROM USER.JS

const User = require("../models/User.js")
const bcrypt = require("bcrypt")



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

