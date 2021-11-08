//mg = mogoose
const mg = require("mongoose")

//connect to database
mg.connect('mongodb://localhost:27017/test')
.then (x=> console.log("success"))
.catch (error => console.log(error))

