const mongoose = require("mongoose");


const DateRangeSchema = new mongoose.Schema({
    startDate: { type: String, required: true },
    endDate: { type: String, required: true }
});

const aceschema = mongoose.Schema({
    Regulation:{
        type:String,
        required:true,
    },
    Semester:{
        type:Number,
        required:true,
    },
    TotalWorkingDaysForSem :{
        type:Number,
        required:true,
    },
    TotalNumberOfHolidays:{
        type:Number,
        required:true,
    },
    TotalNumberOfMonths:{
        type:Number,
        required:true,
    },
    WorkingDaysForMonth:[{
        type:Number,
        required:true,
    }],
    HolidaysForMonth:[{
        type:Number,
    }],
    StartDates:[{
        type:String,
    }],
    EndDates:[{
        type:String,
    }], 
    Holidays:[{
        type:String,
    }]  
});

module.exports = mongoose.model("acedemics",aceschema);