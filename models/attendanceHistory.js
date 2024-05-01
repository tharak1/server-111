const mongoose = require("mongoose");

const RollNumberSchema = mongoose.Schema({
    Regulation : {type: String, required: true},
    Department : {type: String, required: true},
    Section: { type: String, required: true},
    RollNumber: {type: String, required: true},
    TimeTable: [{
        date: {type: String, required: true},
        day: {type: String, required: true},
        PresentStatus : {type:Number},
        TotalPeriods : {type:Number},
        Periods: [
          {
            StartTime: { type: String, required: true },
            EndTime: { type: String, required: true },
            ClassType:{ type: String, required: true},
            ClassName:{ type: String, required: true},
            SubjectName:{ type: String, required: true},
            Subjectcode:{ type: String, required: true},
            LecturerName : { type: String, required: true },
            LecturerId : {type: String, required: true},
            LecturerNumber : {type: String, required: true},
            Substitute : {type: Boolean,default:false, required: true}, 
            SubstituteId : {type: String},
            SubstituteName:{type: String},
            ClassType: { type: String},
            ClassDuration: { type: Number },
            present: {type: Boolean, required: true},
            MarkedAt:{ type: Date, default: Date.now }
          }
        ]
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AttendanceHistory",RollNumberSchema);
