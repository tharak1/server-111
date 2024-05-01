const asyncHandler = require("express-async-handler")
const semmarksModel = require("../models/semmarksModel")

const createSemmarks = asyncHandler(async(req,res)=>{
    const created = await semmarksModel.create(req.body);
    res.status(200).json(created);
});

const getAllSemMarks = asyncHandler(async(req,res)=>{
    const allSemMarks = await semmarksModel.find();
    res.status(200).json(allSemMarks);
});

const semMarksIndividual = asyncHandler(async(req,res)=>{
    let filter ={}
    if(req.query){
        filter = {RollNo:req.query.roolno,SEM:req.query.sem}
    }
    console.log(filter);
    const filtered = await semmarksModel.find(filter);
    res.status(200).json(filtered);
})

module.exports = {createSemmarks,getAllSemMarks,semMarksIndividual};

//,SEM:req.query.sem