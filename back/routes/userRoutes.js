const express = require("express")
const router = express.Router()
const userControler = require("../controllers/user")
const verifyPassword = require('../middleware/verifyPassword');

//ACCESS POINTS FOLLOWING TO API SPECIFICATION FOR THIS PROJECT 
router.post("/signup", verifyPassword, userControler.signUp)
router.post("/login", userControler.login)

module.exports=router