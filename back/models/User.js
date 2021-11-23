// We will be creating USER MODEL using MONGOOSE, then we need MONGOOSE imported. Also, username need to be an email so we will be able to use afterward: require('mongoose-type-email')
const mongoose = require('mongoose')

// Adding this Validator as PLUGIN to ensure the uniqueness of email address
const uniqueValidator = require('mongoose-unique-validator') 

//SCHEME creation
const userSchema = mongoose.Schema({
    // The email address MUST be unique 
    email: {
      type: String,
      unique: true, // condition for email to be unique
      required: [true, "Veuillez entrer votre adresse email"], // condtion to make email field mandatory
    },
    // PASSWORD registration
    password: {
      type: String,
      required: [true, "Veuillez choisir un mot de passe"]
    }
  });


userSchema.plugin(uniqueValidator)
const User = mongoose.model("User", userSchema)



// TO EXPORT USER 
module.exports = User 
