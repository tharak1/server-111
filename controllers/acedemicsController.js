const asynchandler = require("express-async-handler");
const Semester = require("../models/acedemicsModel");
const AttendanceHistory = require("../models/attendanceHistory");
const SubjectsModel = require("../models/individualClassSubjectsModel");
const {assignAttendance} = require("./attendanceHistoryController");
const {createAttendance} = require("./attendanceController");

// const addSemesterData = asynchandler(async(req,res)=>{
//     const data = await Semester.find({Regulation:req.body.Regulation,Semester:req.body.Semester});
//         // console.log(data);


//     if(data.length === 0){
//         const newData =await Semester.create(req.body);
//         // console.log(newData);
//         // const result = await AttendanceHistory.deleteMany({Regulation:req.body.Regulation});
//         assignAttendance(req,res,newData.StartDates[0],newData.EndDates[newData.EndDates.length-1],newData);
//         createAttendance(req,res,newData);

//         res.status(200).json({message:"uploaded sucessfully"});
//     }
//     else{
//         res.status(202).json({message:"already exists"});
//     }
// });


const addSemesterData = asynchandler(async(req, res) => {
    const data = await Semester.find({ Regulation: req.body.Regulation, Semester: req.body.Semester });

    if (data.length === 0) {
        const newData = await Semester.create(req.body);

        // Wrapping assignAttendance and createAttendance in promises
        const assignAttendancePromise = new Promise((resolve, reject) => {
            assignAttendance(req, res, newData.StartDates[0], newData.EndDates[newData.EndDates.length - 1], newData, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        const createAttendancePromise = new Promise((resolve, reject) => {
            createAttendance(req, res, newData, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Using Promise.all to wait for both promises to complete
        try {
            await Promise.all([assignAttendancePromise, createAttendancePromise]);
            console.log("done");
            res.status(200).json({ message: "uploaded successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error executing functions", error: error.message });
        }
    } else {
        res.status(202).json({ message: "already exists" });
    }
});


const updateSemesterData = asynchandler(async(req,res)=>{
    let filter = {};
    const { regulation, semester,month} = req.query;
    if(req.query){
        //const { regulation, semester,month} = req.query;
        filter = {Regulation: regulation, Semester: semester}
    }
    let monthIndex =parseInt(month)-1;
    const { intValue } = req.body;
    

    // const Data = await Semester.findOne(filter);
    // let newWorkingDaysForMonth = Data.WorkingDaysForMonth; 
    // let newHolidaysForMonth = Data.HolidaysForMonth;
    // console.log(newWorkingDaysForMonth,newHolidaysForMonth,Data.TotalWorkingDaysForSem,Data.TotalNumberOfHolidays);

    // newHolidaysForMonth[monthIndex] = newHolidaysForMonth[monthIndex] + intValue;
    // newWorkingDaysForMonth[monthIndex] = newWorkingDaysForMonth[monthIndex] - intValue;
    // Data.TotalWorkingDaysForSem = Data.TotalWorkingDaysForSem - intValue;
    // Data.TotalNumberOfHolidays = Data.TotalNumberOfHolidays + intValue;
    // Data.HolidaysForMonth = newHolidaysForMonth;
    // Data.WorkingDaysForMonth = newWorkingDaysForMonth;

    // res.json(Data);


    const semesterData = await Semester.findOne(filter);
        if (!semesterData) {
            return res.status(404).json({ error: 'Semester data not found' });
        }

        // Update the values in the document
        semesterData.HolidaysForMonth[monthIndex] += intValue;
        semesterData.WorkingDaysForMonth[monthIndex] -= intValue;
        semesterData.TotalWorkingDaysForSem -= intValue;
        semesterData.TotalNumberOfHolidays += intValue;

        // Save the updated document back to the database
        await semesterData.save();

        res.json(semesterData);
});


const fetchAcademicmonths = asynchandler(async(req,res)=>{
    let filter = {};
    const { regulation, semester} = req.query;
    if(req.query){
        filter = {Regulation: regulation, Semester: semester}
    }

    const Data = await Semester.findOne(filter);

    res.json(Data.TotalNumberOfMonths);
})


const getSubjectsForClass = asynchandler(async(req,res)=>{
    let filter = {};
    if(req.query){
        filter = {Regulation: req.query.regulation,Department:req.query.department,Section:req.query.section}
    }

    const subjects = await SubjectsModel.findOne(filter);
    res.status(200).json(subjects.Subjects);
})

module.exports = {addSemesterData,updateSemesterData,fetchAcademicmonths,getSubjectsForClass};