const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
    RollNo: {
        type: String,
        required: true,
        unique: true,
      },
    Regulation:{
      type: String,
      required: true,
    },
      SemesterData: {
        TotalForSem: { type: Number, required: true },
        ClassesAttendedForSem: { type: Number, required: true },
        HolidaysForSem: { type: Number},
        SemPercentage: { type: Number,default:0 },
        TotalDaysAbsentForSem: { type: Number,default:0},
      },
      MonthlyData: {
        TotalForMonth: { type: Number, required: true },
        ClassesAttendedForMonth: { type: Number, required: true },
        HolidaysForMonth: { type: Number},
        MonthlyPercentage: { type: Number,default:0 },
        TotalDaysAbsentForMonth: { type: Number,default:0},
        TotalDaysPresentForMonth: { type: Number,default:0},
      },
      CurrentDay:{
        MorningAttended: { type: Number,default:0},
        AfternoonAttended: { type: Number,default:0},
      }

    
});


module.exports = mongoose.model("Attendance",attendanceSchema);