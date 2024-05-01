const mongoose = require("mongoose");

const preformanceSchema = mongoose.Schema({
    RollNo:{
        type:String,
        required:true,
    },
    MidTotal:[{
        type:Number,
        required:true,
    }],
    MidScored:[{
        type:Number,
        required:true,
    }],
    CGPA:{
        type:Number,
        required:true,
    },
    PreviousSGPA:[{
        type:Number,
        required:true,
    }],
    Backlogs:[{
        type:String,
        required:true,
    }],
    TotalSub:{
        type:Number,
        required:true,
    }
});

module.exports = mongoose.model("Performance",preformanceSchema);