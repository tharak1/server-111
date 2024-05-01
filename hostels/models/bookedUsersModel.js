const mongoose = require("mongoose");

const bookedUsersModel = mongoose.Schema({
    adminId:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    roomDetails:{
        type:{type:String,required:true,},
        floorNumber:{type:Number,required:true},
        roomNumber:{type:Number,required:true},
        bedNumber:{type:Number,required:true},
    }
});


module.exports = mongoose.model("bookedUserModel",bookedUsersModel);
