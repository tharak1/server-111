const asyncHandler = require("express-async-handler");
const attenn = require("../models/attendanceModel");
const UserData = require("../models/userDetailsModel");
const AttendanceHistory = require("../models/attendanceHistory");
const individualClassAttendance = require("../models/individualClassAttendance");


const setAttendance = asyncHandler(async (req, res) => {
  let filter = {};
  
  if(req.query){
    filter = {Section:req.query.section,Department:req.query.department,Regulation:req.query.regulation};
  }
  console.log(filter);

    const { rollNumbers,type } = req.body;
    const rollNumberslist = await UserData.find(filter,{RollNo:1,_id:0});
    var abscentRollNumbers = [];
    var presentRollNumbers = [];

    console.log(type);

  if(type === 'Absentees'){
    abscentRollNumbers = rollNumbers

    filteredList = rollNumberslist.filter(item => !abscentRollNumbers.some(rollNo => rollNo === item.RollNo));

    presentRollNumbers = filteredList.map(item => item.RollNo);
  }
  else{
    presentRollNumbers = rollNumbers

    filteredList = rollNumberslist.filter(item => !presentRollNumbers.some(rollNo => rollNo === item.RollNo));

    abscentRollNumbers = filteredList.map(item => item.RollNo);
  }



    const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
    
  let updateObject = {};

  if (hours < 13 || (hours === 13 && minutes < 20)) {
    // If the current time is before 1:20 PM, set MorningAttended to 1
    updateObject = [{ $set: { 'CurrentDay.MorningAttended': 1 } }];
  } else {
    // If the current time is 1:20 PM or later, set AfternoonAttended to 1
    updateObject = [{ $set: { 'CurrentDay.AfternoonAttended': 1 } }];
  }



  // Update attendance for each student
  for (const student of presentRollNumbers) {    
    const user = await attenn.findOneAndUpdate(
      { RollNo: student },
      updateObject
    );
  }
    
    for (const student of abscentRollNumbers) {
      const user = await attenn.findOneAndUpdate(
        { RollNo: student },
        { 
            $inc: { 'SemesterData.ClassesAttendedForSem': -1 ,'MonthlyData.ClassesAttendedForMonth': -1 },
        }
      );
    }


    
    AttendanceHistoryManuplation(req,res,type,abscentRollNumbers,presentRollNumbers,req.query.time,filter);



  res.status(200).json({ success: true, message: 'Attendance updated successfully',attendees:(presentRollNumbers.length),absentees:abscentRollNumbers});
});




// get it fixed after project PPT i.e export the files 



function getCurrentTimestamp(currentDate) {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const milliseconds = String(currentDate.getMilliseconds()).padStart(6, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}


function getCurrentPeriod(periods,giventime) {
  const currentDate = new Date();
  const currentTime = new Date(`${getCurrentTimestamp(currentDate)} `+`${giventime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); // Format time for HH:MM comparison
  
  return periods.find(period => {
    const startTime = new Date(`${getCurrentTimestamp(currentDate)} ` + period.StartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(`${getCurrentTimestamp(currentDate)} ` + period.EndTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    // console.log(currentTime,startTime,endTime);
    return (currentTime >= startTime && currentTime <= endTime);
  });
}

const AttendanceHistoryManuplation = asyncHandler(async(req,res,type,rollNumbers,presentrnos,time,filter)=>{
  // const currentDate = new Date();
  // console.log(getCurrentTimestamp(currentDate));

  // const today = new Date();
  const currentDate = new Date();


  const {startTime,endTime,currentTime} = req.body;

  console.log(currentTime);
  let periodCode = '';

    await Promise.all(rollNumbers.map(async(rno)=>{
    const rollNumberEntry = await AttendanceHistory.findOne({
      RollNumber: rno,
    });
    const currentPeriod = getCurrentPeriod1(rollNumberEntry.TimeTable.find(entry => entry.date === `${getCurrentTimestamp(currentDate)}`).Periods, startTime, endTime);

    if (currentPeriod) {
      // console.log(currentPeriod);
      periodCode = currentPeriod.Subjectcode;
      currentPeriod.present = false;
    } else {
      console.log("No period found for the current time.");
    }

    await rollNumberEntry.save();
}));


updateIndividualClassSubjectAttendance(req,res,presentrnos,periodCode,filter); 
});



function getCurrentPeriod1(periods,starttime,endtime) {
  const currentDate = new Date();
  const startTime = new Date(`${getCurrentTimestamp(currentDate)} ` + starttime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(`${getCurrentTimestamp(currentDate)} ` + endtime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return periods.find(period => {
    const StartTime = new Date(`${getCurrentTimestamp(currentDate)} ` + period.StartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const EndTime = new Date(`${getCurrentTimestamp(currentDate)} ` + period.EndTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return (startTime === StartTime && endTime === EndTime);
  });
}


const adjustAttendance = asyncHandler(async(req,res)=>{
  let filter = {};
  
  if(req.query){
    filter = {Section:req.query.section,Department:req.query.department,Regulation:req.query.regulation};
  }
  const {selectedDate ,startTime,endTime} = req.body


// filter = {Section:"D",Department:"CSE",Regulation:"MR21"};
// const selectedDate = "2024-02-05"
// startTime = "09:30";
// endTime = "10:20";
console.log(selectedDate);
  const students = await AttendanceHistory.find(filter);

  const filteredArr =await Promise.all(students.map(async (stu) => {
    const currentPeriod = getCurrentPeriod1(stu.TimeTable.find(entry => entry.date === selectedDate).Periods, startTime, endTime);
    return { RollNo: stu.RollNumber, Present: currentPeriod.present };
}));

  // console.log(filteredArr);
  res.status(200).json(filteredArr);
});

// adjustAttendance();



const adgustAttendanceUpdate = asyncHandler(async(req,res)=>{
  let filter = {};
  
  if(req.query){
    filter = {RollNumber:req.query.rollNo};
  }
  const {selectedDate ,startTime,endTime} = req.body
  


// filter = {Section:"D",Department:"CSE",Regulation:"MR21"};
// const selectedDate = "2024-02-05"
// startTime = "09:30";
// endTime = "10:20";

  const students = await AttendanceHistory.findOne(filter);
  const currentPeriod = getCurrentPeriod1(students.TimeTable.find(entry => entry.date === selectedDate).Periods, startTime, endTime);
  currentPeriod.present = !currentPeriod.present;
  await students.save();

  res.status(200).send("Document saved successfully");
  console.log("roger from adjust attendance");

});


const updateIndividualClassSubjectAttendance = asyncHandler(async(req,res,presentrnos,periodcode,filter)=>{

  const current = await individualClassAttendance.findOne(filter);
  if (current) {
    await Promise.all(presentrnos.map(async (rollNo) => {
      // Find the index of the student with the given roll number
      const studentIndex = current.Students.findIndex(student => student.RollNo === rollNo);

      if (studentIndex !== -1) {
          // Find the subject index within the student's subjects array
          const subjectIndex = current.Students[studentIndex].Subjects.findIndex(subject => subject.SubjectCode === periodcode);

          if (subjectIndex !== -1) {
              // Increment the attendance for the subject
              current.Students[studentIndex].Subjects[subjectIndex].Attendance += 1;
          } else {
              console.log({ success: false, message: 'Subject with the given SubjectCode not found for the specified roll number' });
          }
      } else {
          console.log({ success: false, message: 'Roll number not found' });
      }
  }));

  // Save the updated document outside the loop
  await current.save();
  console.log({ success: true, message: 'Attendance incremented successfully' });
} else {
  console.log({ success: false, message: 'Document not found with the specified filter' });
}
});







module.exports = {setAttendance,adjustAttendance,adgustAttendanceUpdate};






































































  

  
 
// module.exports = {setAttendance,adjustAttendance,adgustAttendanceUpdate}; 






