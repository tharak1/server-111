const mongoose = require("mongoose");

const hostelFloorsSchema = mongoose.Schema({
    type:{
        type: String,
        required: true,
    },
    floorNumber: {
        type: Number,
        required: true,
    },
    totalBeds: {
      type: Number,
      required: true,
    },
    availableBeds: {
      type: Number,
      required: true,
    }
});

module.exports = mongoose.model("hostelFloorModel",hostelFloorsSchema);

