const mongoose = require("mongoose");

const individualClassSubjects = mongoose.Schema({
    Regulation:{type:String,required:true},
    Department:{type:String,required:true},
    Section:{type:String,required:true},
    Subjects:[{
        SubjectName:{type:String,required:true},
        SubjectCode:{type:String,required:true},
        LecturerId:{type:String,required:true},
        LecturerName:{type:String,required:true},
    }],
}); 

module.exports = mongoose.model("IndividualClassSubjects",individualClassSubjects);