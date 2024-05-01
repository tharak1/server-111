const asyncHandler = require("express-async-handler");
const floorsModel = require("../models/floorsModel");

const setFloors = asyncHandler(async(req,res)=>{
    
    const floor = await floorsModel.create(req.body);
    res.status(200).json(floor);
});

const getAllFloors = asyncHandler(async(req,res)=>{
    const hostels = await floorsModel.find({type:req.query.type});
    res.status(200).json(hostels);
})


const manageNoOfAvailableBeds = asyncHandler(async(req,res)=>{
    
    const floor = await floorsModel.findOne({type:req.query.type,floorNumber:req.query.floorno});
    floor.availableBeds = floor.availableBeds-1;
    await floor.save();
});

module.exports = {setFloors,getAllFloors,manageNoOfAvailableBeds};