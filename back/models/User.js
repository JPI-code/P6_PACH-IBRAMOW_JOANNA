const mongoose = require('mongoose');
// require('mongoose-type-email');

// On rajoute ce validateur comme plugin
const uniqueValidator = require('mongoose-unique-validator'); // package qui valide l'unicité de l'email

//SCHEME creation
const userSchema = mongoose.Schema({
    // L'email doit être unique
    email: {
      type: String,
      unique: true, // condition for email to be unique
      required: [true, "Veuillez entrer votre adresse email"], // condtion to make email field  mandatory
    },
    // enregistrement du mot de pass
    password: {
      type: String,
      required: [true, "Veuillez choisir un mot de passe"]
    }
  });


userSchema.plugin(uniqueValidator)
const User = mongoose.model("User", userSchema)



// TO EXPORT USER 
module.exports = User 


// const user1 = new userModel(
//     {
//         email: "a@example.com" ,
//         password: "strongPassword",
//     }
// )

// SAVE USER into DB
// const saveUserintoDB = async (user) => {
//     try{
//     await user.save()
//     return true
//     }
//     catch (error) {
//         console.error(error)
//         return false
//     }
// }

// // READ OUT FROM DB
// const readUserFromDB = async ()










// Création d'un model user avec mongoose, on importe donc mongoose
// const mongoose = require('mongoose');
// require('mongoose-type-email');

// // On rajoute ce validateur comme plugin
// const uniqueValidator = require('mongoose-unique-validator'); // package qui valide l'unicité de l'email
// const sanitizerPlugin = require('mongoose-sanitizer-plugin');

// // la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in,
// // s'assurera que deux utilisateurs ne peuvent partager la même adresse e-mail.
// // Utilisation d'une expression régulière pour valider le format d'email.
// // Le mot de passe fera l'objet d'une validation particulière grâce au middleware verifPasword et au model password

// // On crée notre schéma de données dédié à l'utilisateur
// const userSchema = mongoose.Schema({
//   // L'email doit être unique
//   email: {
//     type: String,
//     unique: true,
//     required: [true, "Veuillez entrer votre adresse email"],
//     match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"]
//   },
//   // enregistrement du mot de pass
//   password: {
//     type: String,
//     required: [true, "Veuillez choisir un mot de passe"]
//   }
// });
// // 