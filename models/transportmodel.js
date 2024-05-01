const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  Busno: {
    type: String,
    required: true,
  },
  Routeno: {
    type: String,
    required: true,
  },
  Routename: {
    type: String,
    required: true,
  },
  Routedesc: {
    type: String,
    required: true,
  },

  drivername:{
    type: String,
    required: true,
  },
  driverph: {
    type: Number,
    required: true,
  },
  driverimage:{
    type: String,
    required: true,
  },
  startlocation: {
    type: String,
    required: true,
  },
  currentlocation: {
    type: String,
    required: true,
  },
  starttime: {
    type: String,
    required: true,
  },
  reachtime: {
    type: String,
    required: true,
  },
  Stoplocation : [{
   type: String,
   required:true,
}],
    
});

module.exports = mongoose.model('Bus', busSchema);