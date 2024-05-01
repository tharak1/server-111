// db.getCollection('attendances').aggregate(
//     [
//       {
//         $set: {
//           'SemesterData.TotalForSem': {
//             $subtract: [
//               '$SemesterData.TotalForSem',
//               {
//                 $multiply: [
//                   '$SemesterData.HolidaysForSem',
//                   7
//                 ]
//               }
//             ]
//           },
//           'SemesterData.ClassesAttendedForSem': {
//             $subtract: [
//               '$SemesterData.ClassesAttendedForSem',
//               {
//                 $multiply: [
//                   '$SemesterData.HolidaysForSem',
//                   7
//                 ]
//               }
//             ]
//           },
//           'MonthlyData.TotalForMonth': {
//             $subtract: [
//               '$MonthlyData.TotalForMonth',
//               {
//                 $multiply: [
//                   '$MonthlyData.HolidaysForMonth',
//                   7
//                 ]
//               }
//             ]
//           },
//           'MonthlyData.ClassesAttendedForMonth': {
//             $subtract: [
//               '$MonthlyData.ClassesAttendedForMonth',
//               {
//                 $multiply: [
//                   '$MonthlyData.HolidaysForMonth',
//                   7
//                 ]
//               }
//             ]
//           },
//           'SemesterData.HolidaysForSem': {
//             $add: [
//               '$SemesterData.HolidaysForSem',
//               '$MonthlyData.HolidaysForMonth'
//             ]
//           }
//         }
//       },
//       {
//         $set: {
//           'SemesterData.SemPercentage': {
//             $round: [
//               {
//                 $multiply: [
//                   {
//                     $divide: [
//                       '$SemesterData.ClassesAttendedForSem',
//                       '$SemesterData.TotalForSem'
//                     ]
//                   },
//                   100
//                 ]
//               },
//               2
//             ]
//           },
//           'MonthlyData.MonthlyPercentage': {
//             $round: [
//               {
//                 $multiply: [
//                   {
//                     $divide: [
//                       '$MonthlyData.ClassesAttendedForMonth',
//                       '$MonthlyData.TotalForMonth'
//                     ]
//                   },
//                   100
//                 ]
//               },
//               2
//             ]
//           }
//         }
//       },
//       {
//         $set: {
//           'CurrentDay.MorningAttended': 0,
//           'CurrentDay.AfternoonAttended': 0
//         }
//       }
//     ],
//     { maxTimeMS: 60000, allowDiskUse: true }
//   );



const attenn = require("../models/attendanceModel");
const cron = require('node-cron');

  const updatePercentageAtMidnight = async () => {
    try {
      const result = await attenn.updateMany(
        {},
        [{
          $set: {
            'SemesterData.SemPercentage': {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        '$SemesterData.ClassesAttendedForSem',
                        '$SemesterData.TotalForSem'
                      ]
                    },
                    100
                  ]
                },
                2
              ]
            },
            'MonthlyData.MonthlyPercentage': {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        '$MonthlyData.ClassesAttendedForMonth',
                        '$MonthlyData.TotalForMonth'
                      ]
                    },
                    100
                  ]
                },
                2
              ]
            }
          }
        }]
      );
  
      console.log('Percentage updated successfully:', result);
    } catch (error) {
      console.error('Error updating percentage:', error);
    }
  };


  const updateCurrentDayAttendanceAtMidnight = async () => {
    try {
      const attendanceRecords = await attenn.find({ 'CurrentDay.MorningAttended': 0, 'CurrentDay.AfternoonAttended': 0 });

      for (const record of attendanceRecords) {
          record.SemesterData.TotalDaysAbsentForSem += 1;
          record.MonthlyData.TotalDaysAbsentForMonth += 1;
          await record.save();
      }
      // First, unset the fields
      const unsetResult = await attenn.updateMany({}, { $unset: { 'CurrentDay.MorningAttended': '', 'CurrentDay.AfternoonAttended': '' } });
  
      // Then, set the fields to 0
      const setResult = await attenn.updateMany({}, { $set: { 'CurrentDay.MorningAttended': 0, 'CurrentDay.AfternoonAttended': 0 } });
  
      // Check if any documents were modified
      const totalModifiedCount = unsetResult.modifiedCount + setResult.modifiedCount;
  
      if (totalModifiedCount > 0) {
        console.log(`Successfully updated ${totalModifiedCount} documents`);
      } else {
        console.log('No documents were updated');
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
    }
  };
  
  
  // Schedule the task to run at midnight every day
  cron.schedule('35 14 * * *', () => {
    updatePercentageAtMidnight();
    console.log("8:20");
  });

  cron.schedule('35 14 * * *',()=>{
    updateCurrentDayAttendanceAtMidnight();
    console.log("9.30");
  });
  
  module.exports = {updatePercentageAtMidnight};

  