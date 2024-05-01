const mongoose = require("mongoose");

const semesterMonthlyDataModel = mongoose.Schema({
    Regulation:{
        type:String,
        required:true,
    },
    Semester:{
        type:String,
        required:true,
    },
    TotalMonthsForSemester:{
        type:Number,
        required:true,
    },
    WorkingDaysForSemester:{
        type:Number,
        required:true,
    },
    WorkingDaysForMonth:[{
        type:Number,
        required:true,
    }],
    TotalHolidaysForSemester:{
        type:Number,
        required:true,
    },
    TotalHolidaysForMonth:[{
        type:Number,
        required:true,
    }],
});