const mongoose = require("mongoose");

const individualClassMidMarks = mongoose.Schema({
    Regulation:{type:String,required:true},
    Department:{type:String,required:true},
    Section:{type:String,required:true},
    SubjectName:{type:String,required:true},
    SubjectCode:{type:String,required:true},
    LecturerId:{type:String,required:true},
    LecturerName:{type:String,required:true},
    Mid:{type:String,required:true},
    Students:[{
        RollNo:{type:String,required:true},
        Marks:{type:Number,required:true,default:0}
    }],
});



module.exports = mongoose.model("IndividualClassMidMarks",individualClassMidMarks);