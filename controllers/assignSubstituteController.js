const asyncHandler = require("express-async-handler");
const facultyTimeTableModel = require("../models/facultyTimeTableModel");
const Faculty = require("../models/facultyModel");
const AttendanceHistory = require("../models/attendanceHistory");
const ObjectId = require('mongoose').Types.ObjectId;


const AssignSubstitute = asyncHandler(async(req,res)=>{
    let filter = {};
    if(req.query){ 
        filter = {FacultyDepartment:req.query.facultyDepartment,Day:req.query.day};
    }
    const {StartTime,EndTime} = req.body;
    // console.log(StartTime,EndTime);
    const facultyTimetables = await facultyTimeTableModel.find({FacultyDepartment:filter.FacultyDepartment});
    const kaliFellows = [];
    for(const timetable of facultyTimetables){
      const dayTimetables = [];
      dayTimetables.push(timetable.TimeTable.find(day => day.Day === filter.Day));
      for(const s of dayTimetables){
        let foundElement = s.Periods.find(p => (p.StartTime === StartTime && p.EndTime === EndTime));
        if (foundElement === undefined) {
          kaliFellows.push({
            FacultyId:timetable.FacultyId,
            FacultyName:timetable.FacultyName
          })
        }
      }
    }
    if(kaliFellows.length == 0){
  res.status(201).json({message:"no faculty availabe"});

    }else{
      res.status(200).json(kaliFellows);

    }
});



const settingSubstitute = asyncHandler(async(req,res)=>{
    const {facultyId,facultyName,startTime,endTime,date,day,department,section,regulation,year} = req.body;
    const faculty = await Faculty.findOne({FacultyId:facultyId,FacultyName:facultyName});
    const ff = {
      StartTime:startTime,
      EndTime:endTime,
      Date:date,
      Day:day,
      Department:department,
      Section:section,
      Regulation:regulation,
      Year:year
    }


    // console.log(res.body);
    let dummy = faculty.InQueueSubstituteInfo;
    dummy.push(ff);

    faculty.InQueueSubstituteInfo = dummy;
    // console.log(faculty);
    await faculty.save();


    res.status(200).json(faculty);
});



const acceptRequest = asyncHandler(async(req,res)=>{
  filter = {}
  if(req.query){
    filter = {accept:req.query.accepted};
  }

  console.log("called !!");

  const {facultyId,facultyName,index} = req.body;
  const faculty = await Faculty.findOne({FacultyId:facultyId,FacultyName:facultyName});

  if(filter.accept === "true"){

    dummy = faculty.InQueueSubstituteInfo[index];
    faculty.AcceptedSubstitueInfo.push(dummy);

    faculty.InQueueSubstituteInfo.splice(index, 1);

    await faculty.save();

    const ggg = await AttendanceHistory.find({Regulation:dummy.Regulation,Department:dummy.Department,Section:dummy.Section});
    for(const doc of ggg){
            const timetableToUpdate = doc.TimeTable.find(timetable => timetable.date === dummy.Date);
            const pp = timetableToUpdate.Periods.find(entry => entry.StartTime === dummy.StartTime);
            pp.Substitute = true;
            pp.SubstituteId = facultyId;
            pp.SubstituteName = facultyName
            await doc.save();
    }

  }
  else{
    faculty.InQueueSubstituteInfo.splice(index, 1);
    await faculty.save();
  }
res.status(200).json(faculty)
})

module.exports = {AssignSubstitute,settingSubstitute,acceptRequest};