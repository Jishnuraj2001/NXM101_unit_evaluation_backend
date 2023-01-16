const jwt=require("jsonwebtoken");
require("dotenv").config();


const authenticator=(req,res,next)=>{
    let token=req.headers.authorization;
    if(token){
        const decoded = jwt.verify(token,process.env.key);
        if(decoded){
            let userId=decoded.userID;
            req.body.userID=userId;
            next();
        }else{
            res.send("Please login first!!");
        }
    }else{
        res.send("Please login first!!");
    }
}


module.exports={
    authenticator
}