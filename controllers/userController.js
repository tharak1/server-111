const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async(req,res)=>{
    const{rollno,password} = req.body;
    const newUser = await User.create({rollno,password});
    res.status(200).json(newUser);
});

const loginUser = asyncHandler(async (req,res) =>{
    const {rollno,password} = req.body;
    if(!rollno || !password){
        res.status(400).json({error:"all fields are manditory"});
    }
    const user = await User.findOne({rollno});    
    if(user && (user.password===password)){
            const accessToken = jwt.sign(
                {
                    user : {
                        id : user.id,
                        roolno:user.rollno,
                    }
                },
                process.env.ACCESS_TOKEN_SECERT,
            );
            res.json({token:accessToken});
    }else{
        res.status(400).json({error:"user not found or roolno or password dont match"});
    }
    
});


module.exports = {registerUser,loginUser};