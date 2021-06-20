// Other libraries importing
const express = require('express');


// Self created functions/files/classes
const userController = require('../controllers/user-controller');
const checkAuth = require('../middlewares/check-auth');

const router = express.Router();


// Unauthenticated
router.post("/signup",  userController.userSignup);
router.post("/login", userController.userLogin);

//Midleware to check authentication
router.use(checkAuth);



router.get("/getuser",userController.getUser);
router.post("/postblog",userController.postBlog);
router.get("/getblog",userController.getBlog);

module.exports = router;

