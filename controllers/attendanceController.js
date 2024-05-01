const asyncHandler = require("express-async-handler");
const attenn = require("../models/attendanceModel");
const UserData = require("../models/userDetailsModel");


const createAttendance = asyncHandler(async(req,res,acedemics)=>{
    const prev = await attenn.deleteMany({Regulation:req.body.Regulation});
    const stu = await UserData.find({Regulation:req.body.Regulation});
    stu.forEach(async(s)=>{
        await attenn.create({RollNo:s.RollNo,Regulation:req.body.Regulation,SemesterData:{TotalForSem:acedemics.TotalWorkingDaysForSem*7,ClassesAttendedForSem:acedemics.TotalWorkingDaysForSem*7,HolidaysForSem:acedemics.TotalNumberOfHolidays,SemPercentage:100},MonthlyData:{TotalForMonth:acedemics.WorkingDaysForMonth[0]*7,ClassesAttendedForMonth:acedemics.WorkingDaysForMonth[0]*7,HolidaysForMonth:acedemics.HolidaysForMonth[0],MonthlyPercentage:100}});
    });

});


const getAttendance = asyncHandler(async(req,res)=>{
    const userAtten = await attenn.findOne({RollNo:req.user.roolno});
    res.status(200).json({SemPercentage:userAtten.SemesterData.SemPercentage,MonthlyPercentage:userAtten.MonthlyData.MonthlyPercentage,DayPresent:userAtten.CurrentDay.MorningAttended+userAtten.CurrentDay.AfternoonAttended});
});


module.exports = {createAttendance,getAttendance};