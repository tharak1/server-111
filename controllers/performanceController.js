const asyncHandler = require("express-async-handler");
const Performance = require("../models/performanceModel");
const SemMarks = require("../models/semmarksModel");

const createPerformance = asyncHandler(async(req,res)=>{
    const {backlogs,previous_cgpa,cgpa,mid_scored,mid,rollno} = req.body;
    const per = await Performance.create({backlogs,previous_cgpa,cgpa,mid_scored,mid,rollno});
    res.status(200).json(per);
});

const getPerformance = asyncHandler(async(req,res)=>{
    const userPer = await Performance.findOne({RollNo:req.user.roolno});
    res.status(200).json(userPer);
});




const initPerformance = asyncHandler(async (req, res) => {
    let filter1 ={}
    if(req.query){
        filter1 = {RollNo:req.query.RollNo}
    }
    const semMarks = await SemMarks.find({ RollNo: new RegExp(`^${filter1.RollNo}`) });
    let backlogs = new Set();
    let prev = {};
    let totalSub = 0;
    

    for (const student of semMarks) {
        if (student.RollNo === prev.RollNo) {
            if (student.Grade === "F") {
                backlogs.add(student.CourseName);
            }
            totalSub += 1;
        } else {
            if (prev.RollNo) {
                const studentPerformance = await Performance.findOneAndUpdate(
                    { RollNo: prev.RollNo },
                    {
                        $push: {
                            PreviousSGPA: { $each: [prev.SGPA] },
                            MidTotal: { $each: [100] },
                            MidScored: { $each: [90] },
                        },
                        $addToSet: { Backlogs: { $each: Array.from(backlogs) } },
                        CGPA: prev.CGPA,
                        $inc: { TotalSub: totalSub }
                    },
                    { upsert: true, new: true }
                );
                totalSub = 0;
                backlogs.clear();
            }
            prev = student;
            if (student.Grade === 'F') backlogs.add(student.CourseName);
            totalSub += 1;
        }
    }
    if (prev.RollNo) {
        const studentPerformance = await Performance.findOneAndUpdate(
            { RollNo: prev.RollNo },
            {
                $push: {
                    PreviousSGPA: { $each: [prev.SGPA] },
                    MidTotal: { $each: [100] },
                    MidScored: { $each: [90] },
                },
                $addToSet: { Backlogs: { $each: Array.from(backlogs) } },
                CGPA: prev.CGPA,
                $inc: { TotalSub: totalSub }
            },
            { upsert: true, new: true }
        );
    }

    res.status(200).json("Success");
});




const initPerformanceAll = asyncHandler(async (req, res) => {
    const semMarks = await SemMarks.find();
    let backlogs = new Set();
    let prev = {};
    let totalSub = 0;

    for (const student of semMarks) {
        if (student.RollNo === prev.RollNo) {
            if (student.Grade === "F") {
                backlogs.add(student.CourseName);
            }
            totalSub +=1
        } else {
            if (prev.RollNo) {
                const studentPerformance = await Performance.findOneAndUpdate(
                    { RollNo: prev.RollNo },
                    {
                        $push: {
                            PreviousSGPA: { $each: [prev.SGPA] },
                            MidTotal: { $each: [100] },
                            MidScored: { $each: [90] },
                        },
                        $addToSet: { Backlogs: { $each: Array.from(backlogs) } },
                        CGPA: prev.CGPA,
                        $inc: { TotalSub: totalSub }
                    },
                    { upsert: true, new: true }
                );
                backlogs.clear();
                totalSub = 0;
            }
            prev = student;
            if (student.Grade === 'F') backlogs.add(student.CourseName);
            totalSub +=1
        }
    }
    if (prev.RollNo) {
        const studentPerformance = await Performance.findOneAndUpdate(
            { RollNo: prev.RollNo },
            {
                $push: {
                    PreviousSGPA: { $each: [prev.SGPA] },
                    MidTotal: { $each: [100] },
                    MidScored: { $each: [90] },
                },
                $addToSet: { Backlogs: { $each: Array.from(backlogs) } },
                CGPA: prev.CGPA,
                $inc: { TotalSub: totalSub }
            },
            { upsert: true, new: true }
        );
    }

    res.status(200).json("Success");
});


module.exports = {createPerformance,getPerformance,initPerformance,initPerformanceAll};