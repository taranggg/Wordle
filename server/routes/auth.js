const express = require("express");
const authRouter=express.Router();
const {signin,signup}=require("../controllers/auth");

authRouter.post("/signin",signin);
authRouter.post("/signup",signup);

module.exports=authRouter;