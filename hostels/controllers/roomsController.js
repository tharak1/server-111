const asyncHandler = require("express-async-handler");
const roomsModel = require("../models/roomsModel");

const setRooms = asyncHandler(async(req,res)=>{
    const newRoom =await roomsModel.create(req.body);
    // console.log(req.body);
    res.status(200).json(newRoom);
});

const getRoom = asyncHandler(async(req,res)=>{
    let filter = {};
    if(req.query){
        filter = {type:req.query.type,roomNumber:req.query.roomno,floorNumber:req.query.floorno}
    }

    const room = await roomsModel.findOne(filter);
    res.status(200).json(room);
});

const getRoomsForFloor = asyncHandler(async(req,res)=>{
    let filter = {};
    if(req.query){
        filter = {type:req.query.type,floorNumber:req.query.floorno}
    }
    const room = await roomsModel.find(filter);
    res.status(200).json(room);
})




module.exports = {setRooms,getRoom,getRoomsForFloor};