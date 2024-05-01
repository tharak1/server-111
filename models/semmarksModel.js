const mongoose = require("mongoose");

const semMarksSchema = mongoose.Schema({
    RollNo: {
        type: String
      },
    CourseCode: {
        type: String
      },
    CourseName: {
        type: String
      },
    Int: {
        type: Number
      },
    Ext: {
        type: Number
      },
    Total: {
        type: Number
      },
    GradePoints: {
        type: Number
      },
    Grade: {
        type: String
      },
    Credits: {
        type: Number
      },
    SGPA: {
        type: Number
      },
    CGPA: {
        type: Number
      },
    SEM: {
        type: String
      }
});

module.exports = mongoose.model("SemMarks",semMarksSchema);