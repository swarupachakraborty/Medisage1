const express= require("express")
const router= express.Router()
const studentController = require("../controller/studentController")
const middleWare = require("../middleware/auth.js")



//----------------------------------------------------UserApi----------------------------------------------------------//
router.post('/register', studentController.CreateStudent)
router.post("/login", studentController.userLogin)
router.get("/fetch",middleWare.validateToken,studentController.getStudentdetail)

module.exports = router;
