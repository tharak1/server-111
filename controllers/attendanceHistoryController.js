const asyncHandler = require("express-async-handler");
const UserDetails = require("../models/userDetailsModel");
const TimeTable = require("../models/TTM"); // Assuming your time table model is named TTM
const AttendanceHistory = require("../models/attendanceHistory");
const xlsx = require('xlsx');
const downloadAttendanceModel = require("../models/downloadAttendanceModel");
const path = require('path');
const individualClassSubjectsModel = require("../models/individualClassSubjectsModel");
const individualClassAttendance = require("../models/individualClassAttendance");
const cron = require('node-cron');
const domain = process.env.DOMAIN;




function getDayOfWeek(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function getCurrentTimestamp(currentDate) {
  // const currentDate = new Date();
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

const assignAttendance = asyncHandler(async (req,res,startdate,enddate,newData) => {
  const startDate = new Date(startdate);
  const endDate = new Date(enddate);
  const allStudents = await UserDetails.find({Regulation:req.body.Regulation});
  for (const student of allStudents) {
    // Fetch the section timetable
    const sectionTimetable = await TimeTable.findOne( {Regulation: student.Regulation,Department: student.Department,Section: student.Section });

    if (!sectionTimetable) {
      console.log("Section timetable not found for student", student.RollNo);
      continue;
    }

    const attendanceEntry = new AttendanceHistory({
      Regulation: student.Regulation,
      Department: student.Department,
      Section: student.Section,
      RollNumber: student.RollNo,
      TimeTable: []
    });

    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      const dayOfWeek = getDayOfWeek(currentDate);
      if (dayOfWeek === 'Sunday'|| newData.Holidays.includes(getCurrentTimestamp(currentDate))) {
        continue;
      }


      const timetableEntry = sectionTimetable.TimeTable.find(entry => entry.Day === dayOfWeek);

      if (!timetableEntry) {
        console.log("Timetable entry not found for", student.RollNo, "on", dayOfWeek);
        continue;
      }
      
      attendanceEntry.TimeTable.push({
        date: getCurrentTimestamp(currentDate),
        day: dayOfWeek,
        Periods: timetableEntry.Periods.map(period => ({
          ...period,
          present: true
        }))
      });

      // console.log(currentDate);
    }

    
    await attendanceEntry.save();
    // console.log("Attendance entry created for", student.RollNo, "with multiple days");
  }

  res.json({ message: "Attendance assigned successfully" });
});










const caluclateDayAttendance = asyncHandler(async(req,res)=>{
  const targetDate = '2024-04-30';
  const AllRollNo = await UserDetails.find({},{RollNo:1,_id:0});
  // console.log(AllRollNo);
  for(rno of AllRollNo){
    AttendanceHistory.findOne({ RollNumber: rno.RollNo })
  .then(doc => {
    if (doc) {
      const timetableToUpdate = doc.TimeTable.find(timetable => timetable.date === targetDate);
      // console.log(timetableToUpdate);
      if (timetableToUpdate) {
        const noOfPeriods = timetableToUpdate.Periods.length;
        timetableToUpdate.PresentStatus = timetableToUpdate.Periods.reduce((sum, period) => sum + (period.present ? period.ClassDuration : 0), 0);
        doc.save()
          .catch(error => console.error('Error saving document:', error));
        // console.log('Updated PresentStatus:', timetableToUpdate.PresentStatus);
      } else {
        // console.log('TimeTable not found for the specified date.');
      }
    } else {
      // console.log('Document not found for the specified roll number.');
    }
  })
  .catch(error => console.error('Error retrieving document:', error));

  }
});

cron.schedule('40 17 * * *', () => {
  caluclateDayAttendance();
  console.log("8:20");
});




const getAttendanceByHistories = asyncHandler(async (req, res) => {
  // req.user.roolno
  const userAtten = await AttendanceHistory.findOne({ RollNumber: req.user.roolno });

  if (userAtten) {
    const timeTableData = userAtten.TimeTable;

    // Get today's date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to the beginning of the day

    // Filter entries in TimeTable array until today's date
    const attendanceData = timeTableData.filter(entry => new Date(entry.date) <= currentDate)
                                         .map(entry => ({
                                           date: entry.date,
                                           PresentStatus: entry.PresentStatus
                                         }));

    res.status(200).json(attendanceData );
  } else {
    res.status(404).json({ success: false, message: 'Attendance data not found for the specified roll number' });
  }
});





// const getAttendanceByHistoriesForSpecificSubject = asyncHandler(async (req, res) => {
//   // req.user.roolno
//   const userAtten = await AttendanceHistory.findOne({ RollNumber: "21J41A05R5" });

//   if (userAtten) {
//     const timeTableData = userAtten.TimeTable;

//     // Get today's date
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0); // Set to the beginning of the day

//     // Filter entries in TimeTable array until today's date
//     const attendanceData = timeTableData.filter(entry => new Date(entry.date) <= currentDate)
//                                          .map(entry => ({
//                                            Present:entry.Periods.filter(period => period.Subjectcode == "B0544").map(period => ({
//                                             Date: entry.date,
//                                             Present: period.present
//                                           }))
//                                          }));

//     res.status(200).json({ success: true, data: attendanceData });
//   } else {
//     res.status(404).json({ success: false, message: 'Attendance data not found for the specified roll number' });
//   }
// });






const getAttendanceByHistoriesForSpecificSubject = asyncHandler(async (req, res) => {


  // req.user.roolno
  const userAtten = await AttendanceHistory.findOne({ RollNumber: req.query.rollno });

  if (userAtten) {
    const timeTableData = userAtten.TimeTable;

    // Get today's date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to the beginning of the day

    // Filter entries in TimeTable array until today's date
    const attendanceData = timeTableData
      .filter(entry => new Date(entry.date) <= currentDate)
      .flatMap(entry => entry.Periods.filter(period => period.Subjectcode === req.query.subjectcode )
                                      .map(period => ({ date: entry.date,startTime:period.StartTime, endTime:period.EndTime,present: period.present })));

    res.status(200).json(attendanceData );
  } else {
    res.status(404).json({ success: false, message: 'Attendance data not found for the specified roll number' });
  }
});








const caluclateDayAttendanceUpgraded = asyncHandler(async (req, res) => {
  const startDate = '2024-04-01';
  const endDate = '2024-04-30';

  // Get all distinct RollNo from UserDetails
  const allRollNo = await UserDetails.distinct('RollNo');

  for (const rollNo of allRollNo) {
    // Find AttendanceHistory for each RollNo
    const attendanceHistory = await AttendanceHistory.findOne({ RollNumber: rollNo });

    if (attendanceHistory) {
      // Loop through dates in the range
      for (const date of getDateRange(startDate, endDate)) {
        const timetableToUpdate = attendanceHistory.TimeTable.find(timetable => timetable.date === date);

        if (timetableToUpdate) {
          const noOfPeriods = timetableToUpdate.Periods.length;
          timetableToUpdate.PresentStatus = timetableToUpdate.Periods.reduce((sum, period) => sum + (period.present ? period.ClassDuration : 0), 0);
          await attendanceHistory.save().catch(error => console.error('Error saving document:', error));
          console.log('Updated PresentStatus for date', date, ':', timetableToUpdate.PresentStatus);
        } else {
          console.log('TimeTable not found for the specified date:', date);
        }
      }
    } else {
      console.log('Attendance history not found for the specified roll number:', rollNo);
    }
  }
});

// caluclateDayAttendanceUpgraded();

function getDateRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  endDate = new Date(endDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}




const DataToExcel = asyncHandler(async(req,res)=>{
  let filter = {};
  if(req.query){
    filter = {Regulation:req.query.regulation,Department:req.query.department,Section:req.query.section}
  }

  const {startDate,endDate} = req.body;

  const fileName = `Attendance_${filter.Regulation}-${filter.Department}-${filter.Section}_${startDate}_${endDate}.xlsx`;
  const excelPresent = await downloadAttendanceModel.findOne({AttendanceExcelName:fileName});

  if(!excelPresent){
    const doc = await AttendanceHistory.find(filter);
    const attendanceData = await AttendanceHistory.find({
      'TimeTable.date': { $gte: startDate, $lte: endDate }
    });
  
    const sheetData = [];
    const uniqueDates = new Set();
  
    attendanceData.forEach(doc => {
      doc.TimeTable.forEach(timetable => {
        if (timetable.date >= startDate && timetable.date <= endDate) {
          uniqueDates.add(timetable.date);
        }
      });
    });
  
    const dateColumns = [...uniqueDates].sort((a, b) => new Date(a) - new Date(b)); 
  
    const columnHeaders = ['RollNumber',"Regulation","Department","Section", ...dateColumns, "TotalPresentStatus", "Percentage"];
    sheetData.push(columnHeaders);
  
    attendanceData.forEach(doc => {
      let totalPresentStatus = 0; // Initialize total PresentStatus for each RollNumber
      const rowData = [doc.RollNumber, doc.Regulation, doc.Department, doc.Section];
      const totalDays = dateColumns.length; // Total number of days
  
      dateColumns.forEach(date => {
        const foundTimetable = doc.TimeTable.find(timetable => timetable.date === date);
        const presentStatus = foundTimetable ? foundTimetable.PresentStatus : null;
        rowData.push(presentStatus);
        if (presentStatus) {
          totalPresentStatus += presentStatus; // Add presentStatus to totalPresentStatus
        }
      });
  
      rowData.push(totalPresentStatus); // Push totalPresentStatus to the rowData array
  
      // Calculate the percentage
      const percentage = (totalPresentStatus / (totalDays * 7)) * 100; // Assuming 7 hours per day
      rowData.push(percentage);
  
      sheetData.push(rowData);
    });
    // console.log(sheetData);
  
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    // xlsx.writeFile(workbook, `Attedance ${startDate} - ${endDate}.xlsx`);
  
  
    const folderPath = path.join(__dirname, '../created');
    // console.log(folderPath);
    
    // Save the Excel file to the specific folder
    const filePath = path.join(folderPath, fileName);
    xlsx.writeFile(workbook, filePath);
  
    // Generate a URL for the saved Excel file
    const fileURL = `${domain}/downloadAttendance/${fileName}`;
  
  
  const AttendaceDownload = await downloadAttendanceModel.create({AttendanceExcelName:fileName,Department:filter.Department,Regulation:filter.Regulation,Section:filter.Section,AttendanceExcelAddress:filePath,AttendanceExcelUrl:fileURL});
  
  
  res.status(200).json(AttendaceDownload);
  console.log('Excel sheet generated successfully!');
  }
  else{
    res.status(200).json(excelPresent);

  }
});





const dataToExcelForIndividualClassSubjects = asyncHandler(async(req,res)=>{
  let filter = {};
  if(req.query){
    filter = {Regulation:req.query.regulation,Department:req.query.department,Section:req.query.section}
  }

  // filter = {Regulation:"MR21",Department:"CSE",Section:"D"}

  const fileName = `Subject wise Attendance_${filter.Regulation}-${filter.Department}-${filter.Section}.xlsx`;


  const excelPresent = await downloadAttendanceModel.findOne({AttendanceExcelName:fileName});

  if(!excelPresent){

  const classTimeTable = await individualClassSubjectsModel.findOne(filter);
  const classAttendance = await individualClassAttendance.findOne(filter);

  subjects = classTimeTable.Subjects.map(obj=>obj.SubjectName);

  console.log(subjects);
  const columnHeaders = ['RollNumber',"Regulation","Department","Section", ...subjects];

  const sheetdata = [];
  sheetdata.push(columnHeaders);

  classAttendance.Students.forEach( stu =>{
    rowData = [stu.RollNo,classAttendance.Regulation,classAttendance.Department,classAttendance.Section];
    stu.Subjects.forEach(sub=>{
      rowData.push(sub.Attendance);
    })
    sheetdata.push(rowData);
  });

  // console.log(sheetdata);
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(sheetdata);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Subject wise Attendance');
  const folderPath = path.join(__dirname, '../created');
  const filePath = path.join(folderPath, fileName);
  xlsx.writeFile(workbook, filePath);
  const fileURL = `${domain}/downloadAttendance/${fileName}`;
  const AttendaceDownload = await downloadAttendanceModel.create({AttendanceExcelName:fileName,Department:filter.Department,Regulation:filter.Regulation,Section:filter.Section,AttendanceExcelAddress:filePath,AttendanceExcelUrl:fileURL});
  res.status(200).json(AttendaceDownload);
  console.log('Excel sheet generated successfully!');
}else{
  res.status(200).json(excelPresent);
}

});

// dataToExcelForIndividualClassSubjects();











module.exports = {assignAttendance,getCurrentTimestamp,DataToExcel,dataToExcelForIndividualClassSubjects,getAttendanceByHistories,getAttendanceByHistoriesForSpecificSubject};
