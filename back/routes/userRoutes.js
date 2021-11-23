const express = require("express")
const router = express.Router()
const userControler = require("../controllers/user")

//ACCESS POINTS FOLLOWING TO API SPECIFICATION FOR THIS PROJECT 
router.post("/signup", userControler.signUp)
router.post("/login", userControler.login)

module.exports=router