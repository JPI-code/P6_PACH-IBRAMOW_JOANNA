// fs  check if file exists
const Sauce= require("../models/Sauce")
const fs = require('fs')

exports.createSauce = (req, res, next)=> {
    const sauceProposition = JSON.parse(req.body.sauce);

delete sauceProposition._id;
// Creation of the new Sauce example following the SAUCE model

  const sauce = new Sauce({
    //sauceProposition correspond to Sauce Model (from Sauce.js) and what the final user input when create new sauce - fornt end creation form
    ...sauceProposition,
    // We modify  image URL to be complete and dymanic 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
    sauce.save()
    // We send response to FRONT END avec the status 201 - IF NOT: we obtain request expiration
    .then(() => res.status(201).json({
      message: 'Sauce enregistrée !'
    }))
    // We add error code (in cas of some issues) with explicit error message
    .catch(error => res.status(400).json({
      message: 'Impossible à enregistrer votre sauce'
    }));
}


exports.deleteSauce = (req, res, next) => {
  // Before deleting the object (Sauce), we will first search for it to obtain image URL and to delete image file from database
    Sauce.findOne({
        //MangoDB will automatically add new sauce _id
        _id: req.params.id
      })
      .then(sauce => {
        //To extract this file, we retrieve SAUCE url, and we split it around string of characters, namely file name
        const filename = sauce.imageUrl.split('/images/')[1];
        //Having already that file name, we call UNLINK to delete the file
        fs.unlink(`./images/${filename}`, () => {
          //We delete the corresponding document from database
          Sauce.deleteOne({
              _id: req.params.id
            })
            .then(() => res.status(200).json({
              message: 'Sauce supprimée !'
            }))
            .catch(error => res.status(400).json({
              message: 'Impossible à supprimer votre sauce'
            }));
        });
      })
      .catch(error => res.status(500).json({
        message: "Ce sauce n'existe pas dans cette base"
      }));
  };

  //DISPLAY ONE SINGKE SAUCE ACCORDING TO _ID
  exports.getOneSauce = (req, res, next) => {
    // We use the method findOne with the comparison object, we want that Sauce id to be the same as it is in the request parameter
    Sauce.findOne({
        _id: req.params.id
      })
      // IF OK: then we return response and the object
      .then(sauce => res.status(200).json(sauce))
      // IF NOT OK (error): then we generate error 404 to inform that object cannot be found
      .catch(error => res.status(404).json({
        message: "Ce sauce n'existe pas dans cette base"
      }));
  };
  
  
  // IT ALLOWS TO RETRIEVE ALL SAUCES FROM THE DATABASE MongoDB
  exports.getAllSauce = (req, res, next) => {
    // We use the method find to obtain the complete list of all sauces found in this database, the array of all sauces
    Sauce.find()
      // IF OK: we return array of all sauces
      .then(sauces => res.status(200).json(sauces))
      // IF NOT OK (error): we return error message
      .catch(error => res.status(400).json({
        message: "Il n'a pas encore de sauce dans cette base"
      }));
  };
  exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    req.file ? (
      // If the modification contains new IMAGE then we will be using ternary operator as conditional structure
      Sauce.findOne({
        _id: req.params.id
      }).then((sauce) => {
        //We delete old image from  the server
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlinkSync(`images/${filename}`)
      }),
      sauceObject = {
        // We modify data and we add new image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    ) : ( // TERNARY OPERATOR is an equivalent of function  if() {} else {} => condition ? Instruction if true : Instruction if false

    
    // If modifation DOES NOT contain new image
      sauceObject = {
        ...req.body
      }
    )
    Sauce.updateOne(
        // We apply sauceObject parameters
        {
          _id: req.params.id
        }, {
          ...sauceObject,
          _id: req.params.id
        }
      )
      .then(() => res.status(200).json({
        message: 'Sauce modifiée !'
      }))
      .catch((error) => res.status(400).json({
        message: "Sauce non trouvée"
      }))
  }

  exports.likeDislike = (req, res, next) => {
    // For the route READ = Add OR delete "Like" / "Dislike" to a sauce
    // Case when Like is present in the body
    let like = req.body.like
    // We take userId to IDENTIFY him/her
    let userId = req.body.userId
    // We take sauceId to MODIFY it
    let sauceId = req.params.id
  
    if (like === 1) { //If it concerns a LIKE
      Sauce.updateOne({
          _id: sauceId
        }, {
          // We push the user and we increase the counter +1
          //$push and $inc are the fonctions predefined in MONGODB
          $push: {
            usersLiked: userId
          },
          $inc: {
            likes: +1
          }, // We increase +1
        })
        .then(() => res.status(200).json({
          message: 'j\'aime ajouté !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
    }
    if (like === -1) {
      Sauce.updateOne( // If it concerns a DISLIKE 
          {
            _id: sauceId
          }, {
            $push: {
              usersDisliked: userId
            },
            $inc: {
              dislikes: +1
            }, // We increase +1
          }
        )
        .then(() => {
          res.status(200).json({
            message: 'Dislike ajouté !'
          })
        })
        .catch((error) => res.status(400).json({
          error
        }))
    }
    if (like === 0) { // If it concerns CANCELLING of a LIKE or DISLIKE
      Sauce.findOne({
          _id: sauceId
        })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { //If it concerns cancelling of a LIKE
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersLiked: userId
                },
                $inc: {
                  likes: -1
                }, // we decrease -1
              })
              .then(() => res.status(200).json({
                message: 'Like retiré !'
              }))
              .catch((error) => res.status(400).json({
                error
              }))
          }
          if (sauce.usersDisliked.includes(userId)) { //If it concerns cancelling of a dislike
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersDisliked: userId
                },
                $inc: {
                  dislikes: -1
                }, // We decrease -1
              })
              .then(() => res.status(200).json({
                message: 'Dislike retiré !'
              }))
              .catch((error) => res.status(400).json({
                error
              }))
          }
        })
        .catch((error) => res.status(404).json({
         error
        }))
    }
  }