const mongoose = require("mongoose");

const parentSchema = mongoose.Schema({
    childrollno:{
        type:String,
    },
    parentphno:{
        type:String,
        required:true,
    },
    parentpassword:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model("Parent",parentSchema);