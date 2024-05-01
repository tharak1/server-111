const mongoose = require("mongoose");

const AttendanceDownloadSchema = mongoose.Schema({
    AttendanceExcelName:{
        type:String,
        required:true,
    },
    Department:{
        type:String,
        required:true,
    },
    Regulation:{
        type:String,
        required:true,
    },
    Section:{
        type:String,
        required:true,
    },
    AttendanceExcelAddress:{
        type:String,
        required:true,
    },
    AttendanceExcelUrl:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model("AttendanceExcelDownload",AttendanceDownloadSchema);