const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const cors = require('cors')

const userRoutes= require("./routes/userRoutes")
const sauceRoutes= require("./routes/sauceRoutes")

//CONNECTING TO DATABASE
mongoose.connect("mongodb://localhost:27017/testingDataBase",
{useNewUrlParser:true})
.then (()=> console.log("connected to database"))
.catch (() => console.error("Error in database connection"))




// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
// app.use((req, res, next) => {
//   // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//   // on indique les méthodes autorisées pour les requêtes HTTP
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   // on autorise ce serveur à fournir des scripts pour la page visitée
//   res.setHeader('Content-Security-Policy', "default-src 'self'");
//   next();
// });

app.use(cors());
app.use(bodyParser.json());
//setting up 
app.use("/images", express.static("./images"))
app.use("/api/auth", userRoutes)
app.use("/api/sauces", sauceRoutes)

module.exports = app;