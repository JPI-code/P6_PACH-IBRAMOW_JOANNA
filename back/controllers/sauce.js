const Sauce= require("../models/Sauce")
const fs = require('fs')

exports.createSauce = (req, res, next)=> {
    const sauceProposition = JSON.parse(req.body.sauce);
    const sauce= new Sauce ({
userId : sauceProposition.userId,
name : sauceProposition.name,
manufacturer : sauceProposition.manufacturer,
description : sauceProposition.description,
mainPepper : sauceProposition.mainPepper,
imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
heat : sauceProposition.heat,
likes : 0,
dislikes : 0,
usersLiked : [],
usersDisliked : [],
    })
    sauce.save()
    // On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
    .then(() => res.status(201).json({
      message: 'Sauce enregistrée !'
    }))
    // On ajoute un code erreur en cas de problème
    .catch(error => res.status(400).json({
      message: 'Impossible à enregistrer votre sauce'
    }));
  //.catch(error => {
  //res.writeHead( 400, '{"message":"Format des champs du formulaire sauce ne validant pas le middleware sauceValidation"}', {'content-type' : 'application/json'});
  //res.end('Format des champs du formulaire invalide');
  //})
}


exports.deleteSauce = (req, res, next) => {
    // Avant de suppr l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
    Sauce.findOne({
        //MangoDB will automatically add new sauce _id
        _id: req.params.id
      })
      .then(sauce => {
        // Pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
        // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
        fs.unlink(`./images/${filename}`, () => {
          // On supprime le document correspondant de la base de données
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
    // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
    Sauce.findOne({
        _id: req.params.id
      })
      // Si ok on retourne une réponse et l'objet
      .then(sauce => res.status(200).json(sauce))
      // Si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
      .catch(error => res.status(404).json({
        message: "Ce sauce n'existe pas dans cette base"
      }));
  };
  
  // Permet de récuperer toutes les sauces de la base MongoDB
  
  exports.getAllSauce = (req, res, next) => {
    // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauves de la base de données
    Sauce.find()
      // Si OK on retourne un tableau de toutes les données
      .then(sauces => res.status(200).json(sauces))
      // Si erreur on retourne un message d'erreur
      .catch(error => res.status(400).json({
        message: "Il n'a pas encore de sauce dans cette base"
      }));
  };
  exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    req.file ? (
      // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
      Sauce.findOne({
        _id: req.params.id
      }).then((sauce) => {
        // On supprime l'ancienne image du serveur
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlinkSync(`images/${filename}`)
      }),
      sauceObject = {
        // On modifie les données et on ajoute la nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
      // Si la modification ne contient pas de nouvelle image
      sauceObject = {
        ...req.body
      }
    )
    Sauce.updateOne(
        // On applique les paramètre de sauceObject
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
    // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
    // Like présent dans le body
    let like = req.body.like
    // On prend le userID pour l'identifier
    let userId = req.body.userId
    // On prend l'id de la sauce pour pouvoir le modifier
    let sauceId = req.params.id
  
    if (like === 1) { // Si il s'agit d'un like
      Sauce.updateOne({
          _id: sauceId
        }, {
          // On push l'utilisateur et on incrémente le compteur de 1
          //$push and $inc are the fonctions predefined in MONGODB
          $push: {
            usersLiked: userId
          },
          $inc: {
            likes: +1
          }, // On incrémente de 1
        })
        .then(() => res.status(200).json({
          message: 'j\'aime ajouté !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
    }
    if (like === -1) {
      Sauce.updateOne( // S'il s'agit d'un dislike
          {
            _id: sauceId
          }, {
            $push: {
              usersDisliked: userId
            },
            $inc: {
              dislikes: +1
            }, // On incrémente de 1
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
    if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
      Sauce.findOne({
          _id: sauceId
        })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersLiked: userId
                },
                $inc: {
                  likes: -1
                }, // On incrémente de -1
              })
              .then(() => res.status(200).json({
                message: 'Like retiré !'
              }))
              .catch((error) => res.status(400).json({
                error
              }))
          }
          if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersDisliked: userId
                },
                $inc: {
                  dislikes: -1
                }, // On incrémente de -1
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