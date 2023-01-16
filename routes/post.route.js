const express = require("express");
const postRouter = express.Router();

const { Postmodel } = require("../models/post.model");

postRouter.get("/", async (req, res) => {
    let queryObj={};
    const{device,device1,device2}= req.query;
    if(device){
        queryObj["device"]=device;
    }else if(device1&&device2){
        queryObj={$and:[{device1},{device2}]};
    }
    try {
        const data = await Postmodel.find(queryObj);
        res.send(data);
    } catch (error) {
        console.log(error.message);
        res.send("unable to get the posts");
    }
})

postRouter.post("/create",async(req,res)=>{
    const data=req.body;
    try {
        const postData=new Postmodel(data);
        await postData.save();
        res.send("new Post is added to the database");
    } catch (error) {
        console.log(error.message);
        res.send("unable to add new post to the database");
    }
})


postRouter.patch("/update/:id",async(req,res)=>{
    const id=req.params.id;
    const newData=req.body;
    try {
        let postData=await Postmodel.findOne({"_id":id});
        if(postData){
            const post_user_id=postData.userID;
            const req_user_id=req.body.userID;
            if(post_user_id==req_user_id){
                await Postmodel.findByIdAndUpdate({"_id":id},newData);
                res.send(`post data with id=>${id} is updated`);
            }else{
                res.send({"msg":"You are not Authorized to update this data"});
            }
        }else{
            res.send(`There is no post data with id=${id}`);
        }
    } catch (error) {
        console.log(error.message);
        res.send({"msg":"You are not Authorized"});
    }
})


postRouter.delete("/delete/:id",async(req,res)=>{
    const id=req.params.id;
    try {
        let postData=await Postmodel.findOne({"_id":id});
        if(postData){
            const post_user_id=postData.userID;
            const req_user_id=req.body.userID;
            if(post_user_id==req_user_id){
                await Postmodel.findByIdAndDelete({"_id":id});
                res.send(`post data with id=>${id} is deleted`);
            }else{
                res.send({"msg":"You are not Authorized"});
            }
        }else{
            res.send(`There is no post data with id=${id}`);
        }
    } catch (error) {
        console.log(error.message);
        res.send({"msg":"You are not Authorized to delete this data"});
    }
})



module.exports={
    postRouter
}