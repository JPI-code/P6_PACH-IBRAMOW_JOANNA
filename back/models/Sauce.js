const mongoose = require('mongoose');
// require('mongoose-type-email');


//SCHEME creation
const sauceSchema = mongoose.Schema({
    // following the model precise in Specs
    userId: {
      type: String,
      required: true,
    },
    name: {
        type: String,
        required: true,
      },
    manufacturer: {
        type: String,
        required: true,
      },
    description: {
        type: String,
        required: true,
      },
    mainPepper: {
        type: String,
        required: true,
      },
    imageUrl: {
        type: String,
        required: true,
      },
    heat: {
        type: Number,
        required: true,
      },
    likes: {
        type: Number,
      },
    dislikes: {
        type: Number,
      },
    usersLiked: {
        type: [String],
      },
    usersDisliked: {
        type: [String],
      },
  });



const Sauce = mongoose.model("Sauce", sauceSchema)



// TO EXPORT SAUCE 
module.exports = Sauce

