const app = require('./app')
const http = require('http')

const port = 3000


// Créer un serveur avec express qui utilise app
// création d'une constante pour les appels serveur (requetes et reponses)
// const server = http.createServer(app); // https requiert un certificat SSL à obtenir avec un nom de domaine
// app.listen(port, ()=> console.log("Listening on port 3000"))

//Declaring port for app as well as for the server
//where port=3000
app.set("port", process.env.PORT || port)
//To create server from app
const server = http.createServer(app);

//Event handling
server.on("listening", ()=> {
    console.log(`Listening on ${port}`)
})
server.listen(process.env.PORT || port);