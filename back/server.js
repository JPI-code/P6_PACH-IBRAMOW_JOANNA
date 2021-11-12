const app = require('./app')
const port = 3000



// Créer un serveur avec express qui utilise app
// création d'une constante pour les appels serveur (requetes et reponses)
// const server = http.createServer(app); // https requiert un certificat SSL à obtenir avec un nom de domaine
// app.listen(port, ()=> console.log("Listening on port 3000"))

const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur !');
});

server.listen(3000);