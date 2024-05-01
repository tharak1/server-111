const mongoose = require("mongoose");

const hostelRoomsSchema = mongoose.Schema({
    type:{
        type:String,
        required:true,
    },
    floorNumber:{
        type:Number,
        required:true
    },
    roomNumber:{
        type:Number,
        required:true 
    },
    beds:[{
        bedNumber:{
           type:Number,
           required:true
        },
        isBooked:{
            type:Boolean,
            required:true,
            default:false,
        },
        bookedBy:{
            type:String,
            required:true,
            default:"No one Booked"
        },
        bookedById:{
            type:String,
            required:true,
            default:"No one Booked"
        },
    }]
});

hostelRoomsSchema.virtual('totalBeds').get(function() {
    return this.beds.length;
});

hostelRoomsSchema.virtual('bedsNotBooked').get(function() {
    return this.beds.filter(bed => !bed.isBooked).length;
});

hostelRoomsSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model("hostelRooms",hostelRoomsSchema);