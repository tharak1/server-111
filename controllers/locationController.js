const asyncHandler = require("express-async-handler");
const Location = require("../models/locationModel");

const setLocation = asyncHandler(async(req,res)=>{
    let filter = {};
    if(req.query){
        const {busno} = req.query;
        filter = {Busno:busno}
    }
    const { latitude, longitude } = req.body;
    const location =await Location.findOne(filter);
    // console.log(location);
    if(location){
        location.latitude = latitude;
        location.longitude = longitude;
        await location.save();
    }
    else{
        const location = await Location.create({Busno:filter.Busno,latitude:latitude,longitude:longitude});
        console.log("created ");
    }

  
      console.log(`Location data saved: Latitude: ${latitude}, Longitude: ${longitude}`);
});


const getLocation = asyncHandler(async(req,res)=>{
    let filter = {};
    if(req.query){
        const {busno} = req.query;
        filter = {Busno:busno}
    }
    const location =await Location.findOne(filter);
    res.json(location);

});


module.exports = {setLocation,getLocation};  