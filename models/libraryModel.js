const mongoose = require("mongoose");

const librarySchema = mongoose.Schema({
    RollNo:{
        type:String,
        required:true,
    },
    booksTaken:[{
        type:String,
        required:true,
    }],
    dateTaken:[{
        type:String,
        required:true,
    }] 
});
module.exports = mongoose.model("Library",librarySchema);