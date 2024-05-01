const asyncHandler = require("express-async-handler");
const UserData = require("../models/userDetailsModel");
const jwt=require("jsonwebtoken");
const Faculty = require("../models/facultyModel");

const getUserData = asyncHandler(async(req,res)=>{
    const currentUser = await UserData.findOne({RollNo : req.user.roolno});
    res.json(currentUser);
});

const getallUserData = asyncHandler(async(req,res)=>{
    const currentUser = await UserData.find();
    res.json(currentUser);
});

const getAllUsersDataAsSection = asyncHandler(async(req,res)=>{
    
    let filter = {};
    if(req.query){ 
        filter = {Section:req.query.section,Department:req.query.department,Regulation:req.query.regulation};
    }

    const currentUsers = await UserData.find(filter,{'RollNo':1,'StudentName':1,'_id':0});
    console.log(filter);
    res.json(currentUsers);
});


const getStudentsDataFORchat = asyncHandler(async(req,res)=>{
    filter = {};
    if(req.body){
        filter = {FacultyId:req.body.Id};
    }

    const faculty = await Faculty.findOne(filter);

    const result = [];
    for(clas of faculty.Classes){
        const students = await UserData.find({Regulation:clas.Regulation,Department:clas.Department,Section:clas.Section},{RollNo:1,StudentName:1,Department:1,Section:1,_id:0});
        changed = students.map((obj)=>{
            sai = {
                Id:obj.RollNo,
                Name:obj.StudentName,
                Department:clas.Department,
                optional:clas.Section
            }
            result.push(sai);
        });
        // console.log(changed);
    }

    res.json(result);
});


const getParentsForChat = asyncHandler(async(req,res)=>{
    filter = {};
    if(req.body){
        filter = {FacultyId:req.body.Id};
    }

    const faculty = await Faculty.findOne(filter);

    const result = [];
    for(clas of faculty.Classes){
        const students = await UserData.find({Regulation:clas.Regulation,Department:clas.Department,Section:clas.Section},{RollNo:1,StudentName:1,FatherName:1,FatherPhnNo:1,Department:1,_id:0});
        changed = students.map((obj)=>{
            sai = {
                Id:`${obj.RollNo}-${obj.FatherPhnNo}`,
                Name:obj.FatherName,
                Department:obj.Department,
                optional:obj.StudentName
            }
            result.push(sai);
        });
        // console.log(changed);
    }

    res.json(result);
});



const getFacultyForChat = asyncHandler(async(req,res)=>{
    filter = {};
    if(req.body){
        filter = {FacultyId:req.body.Id};
    }

    const faculty = await Faculty.findOne(filter);

    const result = [];
    for(clas of faculty.Classes){
        const students = await Faculty.find({FacultyDepartment:clas.Department},{FacultyId:1,FacultyName:1,FacultyPhnNo:1,FacultyDepartment:1,_id:0});
        changed = students.map((obj)=>{
            sai = {
                Id:obj.FacultyId,
                Name:obj.FacultyName,
                Department:obj.FacultyDepartment,
                optional:obj.FacultyPhnNo
            }
            result.push(sai);
        });
        // console.log(changed);
    }
    res.json(result);
});





const getFacultyStudentForChat = asyncHandler(async(req,res)=>{
    filter = {};
    if(req.body){
        filter = {RollNo:req.body.Id};
    }

    const stu = await UserData.findOne(filter);

    const result = [];
        const students = await Faculty.find({FacultyDepartment:stu.Department},{FacultyId:1,FacultyName:1,FacultyPhnNo:1,FacultyDepartment:1,_id:0});
        changed = students.map((obj)=>{
            sai = {
                Id:obj.FacultyId,
                Name:obj.FacultyName,
                Department:obj.FacultyDepartment,
                optional:obj.FacultyPhnNo
            }
            result.push(sai);
        });
        // console.log(changed);
    res.json(result);
});






const createUserData = asyncHandler(async(req,res)=>{
    //const {rollno,imageurl,name,branch,clas,studentphno,studentemail,parentname,parentphno,parentemail} = req.body;
    const newUserDetails =await UserData.create(req.body);
    res.status(200).json(newUserDetails);
});

const deleteUserData = asyncHandler(async(req,res)=>{
    const deletedUser = await UserData.findByIdAndRemove(req.params.id);
    res.status(200).json({dUser:deletedUser,message:"succes"});
});

const deleteAllUsersData = asyncHandler(async(req,res)=>{
    await UserData.deleteMany();
    res.status(200).json({message:"success"});
});

const validateUser = asyncHandler(async(req,res)=>{
    res.json(req.user);
});


const loginUser = asyncHandler(async (req,res) =>{
    const {UserName,Password} = req.body;
    console.log(req.body);
    if(!UserName || !Password){
        res.status(400).json({error:"all fields are manditory"});
    }
    const user = await UserData.findOne({UserName});   
    console.log(user) 
    if(user && (user.Password===Password)){
            const accessToken = jwt.sign(
                {
                    user : {
                        id : user.id,
                        roolno :user.RollNo,
                    }
                },
                process.env.ACCESS_TOKEN_SECERT,
            );
            res.json({token:accessToken});
    }else{
        res.status(400).json({error:"user not found or roolno or password dont match"});
    }
    
});

module.exports = {getUserData,createUserData,deleteAllUsersData,deleteUserData,getallUserData,validateUser,getAllUsersDataAsSection,loginUser,getStudentsDataFORchat,getParentsForChat,getFacultyForChat,getFacultyStudentForChat};