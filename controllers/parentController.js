const asyncHandler = require("express-async-handler");
const UserData = require("../models/userDetailsModel");
const Parent = require("../models/parentModel");
const jwt = require("jsonwebtoken");

const parentLogin = asyncHandler(async(req,res)=>{
    const {parentphno,parentpassword} = req.body;

    if(!parentphno || !parentpassword){
        res.status(400).json({error:"all fields are manditory"});
    }
    else{
        const validateParent = await Parent.findOne({parentphno});
    if(validateParent && (validateParent.parentpassword===parentpassword)){
        const accessToken = jwt.sign(
            {
                user : {
                    id : validateParent.id,
                    roolno:validateParent.childrollno,
                }
            },
            process.env.ACCESS_TOKEN_SECERT,
        );
        res.status(200).json({token:accessToken});
    }
    else{
        //console.log("hiiiiii");
        const child = await UserData.findOne({FatherPhnNo:parentphno});
    if(child){
        const foundParent = await Parent.create({parentphno:child.FatherPhnNo,parentpassword:child.FatherPhnNo,childrollno:child.RollNo});
        const validateParent = await Parent.findOne({parentphno});
    if(validateParent && (validateParent.parentpassword===parentpassword)){
        const accessToken = jwt.sign(
            {
                user : {
                    id : validateParent.id,
                    roolno:validateParent.childrollno,
                }
            },
            process.env.ACCESS_TOKEN_SECERT,
        );
        res.status(200).json({token:accessToken});
    }
    }
    else{
        res.status(400).json({error:"user not found or roolno or password dont match"});
    }
    }
    }
});

module.exports = {parentLogin};