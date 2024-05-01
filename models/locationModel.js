const mongoose = require('mongoose');

// Define the schema for location data
const locationSchema = new mongoose.Schema({
    Busno:{
        type: String,
        required: true
    },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create the MongoDB model
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
