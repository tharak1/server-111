const mongoose = require("mongoose");

const individualClassAttendance = mongoose.Schema({
    Regulation:{type:String,required:true},
    Department:{type:String,required:true},
    Section:{type:String,required:true},
    Students:[{
        RollNo:{type:String,required:true},
        Subjects:[{
            SubjectName:{type:String,required:true},
            SubjectCode:{type:String,required:true},
            Attendance:{type:Number,required:true,default:0}
        }],
    }],
});


module.exports = mongoose.model("IndividualClassAttendance",individualClassAttendance);