const mongoose=require("mongoose");
mongoose.set('strictQuery', true);

const express=require("express");
const app=express();
app.use(express.json());
require("dotenv").config();
const cors=require("cors");
app.use(cors());

const{connection}=require("./config/db");
const{userRouter}=require("./routes/user.route");
const {postRouter}=require("./routes/post.route");
const{authenticator}=require("./middlewares/authenticator.middleware");


app.get("/",(req,res)=>{
    res.send("Welcome to the home page");
})

app.use("/users",userRouter);

app.use(authenticator);
app.use("/posts",postRouter);




app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("CONNECTED TO DATABASE");
    } catch (error) {
        console.log("unable to connect to the database");
    }
    console.log(`server is running at =http://localhost:${process.env.port}`);
})