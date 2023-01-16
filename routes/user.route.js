const express=require("express");
const userRouter=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();

const{Usermodel}=require("../models/user.model");

userRouter.post("/register",async(req,res)=>{
    const{name,email,gender,password}=req.body;
    try {
        bcrypt.hash(password, 7,async(err, hash)=>{
            if(err){
                console.log(err.message);
                res.send("registration failed!");
            }else{
                const data=new Usermodel({name,email,gender,"password":hash});
                await data.save();
                res.send("Registration succesful");
            }
        });
    } catch (error) {
        console.log(error.message);
        res.send("registration failed!")
    }
})



userRouter.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    const user=await Usermodel.findOne({email});
    try {
        if(user){
            bcrypt.compare(password,user.password, function(err, result) {
                if(result==true){
                    const token = jwt.sign({ userID:user._id},process.env.key);
                    res.send({"msg":"login successful","token":token});
                }else{
                    res.send("Wrong credentials");
                }
            });
        }else{
            res.send("Wrong credentials");
        }
    } catch (error) {
        console.log(error.message);
        res.send("Wrong credentials");
    }
})



module.exports={
    userRouter
}