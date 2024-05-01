const asyncHandler = require("express-async-handler");
const midMarksModel = require("../models/midMarksModel");

const  findSubjectsWithTheCurrentFaculty = asyncHandler(async(req,res)=>{
    let filter = {};
    if(req.query){
      filter = {Regulation:req.query.regulation,Department:req.query.department,Section:req.query.section,LecturerId:req.body.LecturerId};
    }
    const current = await midMarksModel.find(filter,{Regulation:1,Department:1,Section:1,SubjectName:1,SubjectCode:1,LecturerId:1,Mid:1,_id:0});
    res.status(200).json(current);
});



const giveRnoForSelectedSub = asyncHandler(async(req,res)=>{
    let filter = {};
    if(req.query){
      filter = {Regulation:req.query.regulation,Department:req.query.department,Section:req.query.section,LecturerId:req.body.LecturerId,Mid:req.body.Mid};
    }
    // filter = {Regulation:"MR21",Department:"CSE",Section:"D",LecturerId:"MREC-MBA-027",Mid:"mid1"};
    const current = await midMarksModel.findOne(filter);

    res.status(200).json(current.Students);

});
// giveRnoForSelectedSub();


const updateMidMarks = asyncHandler(async(req, res) => {
  try {
    const midMarksData = req.body;
    const updatedMidMarks = await midMarksModel.findOneAndUpdate(
      { Regulation: req.body.Regulation, Department: req.body.Department, Section: req.body.Section, LecturerId: req.body.LecturerId, Mid: req.body.Mid },
      midMarksData,
      { new: true }
    );
    if (!updatedMidMarks) {
      return res.status(404).json({ message: "not found" });
    }
    // console.log(updatedMidMarks); // Note the variable name is updatedMidMarks, not updateMidMarks
    res.status(200).json({ message: "updated" });
  } catch (error) {
    console.error("Error updating mid marks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = {giveRnoForSelectedSub,findSubjectsWithTheCurrentFaculty,updateMidMarks}