const express= require("express");
const router=express.Router();
router.get("/login",(req,res)=>{
    //res.send("<h1>hello</h1>");
    res.render("login");
});

router.get("/register",(req,res)=>{
    //res.send("<h1>hello</h1>");
    res.render("register");
});

router.get("/",(req,res)=>{
    //res.send("<h1>hello</h1>");
    res.render("index");
});
router.get("/profile",(req,res)=>{
  
    res.render("profile");
});
module.exports=router;