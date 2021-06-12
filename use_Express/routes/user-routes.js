const express =require('express');

const router=express.Router();

router.post("./signup",someMethod);
router.post("./login",someMethod);

router.get("/getInfo",someMethod);

module.exports=router;
