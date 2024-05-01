const asyncHandler = require("express-async-handler");
const bookedUsersModel = require("../models/bookedUsersModel");
const floorModel = require("../models/floorsModel");
const roomsModel = require("../models/roomsModel");


const createRooms = asyncHandler(async(req,res)=>{
    const{type,floorno,roomsarr,noofbedsperroom} = req.body;

    // console.log(req.body);

    const floorData1 = await floorModel.findOne({type:type,floorNumber:floorno});
    // console.log(floorData1);
    if(!floorData1){
        totalBedsNumber = roomsarr.length * noofbedsperroom;

        const floorData = await floorModel.create({type:type,floorNumber:floorno,totalBeds:totalBedsNumber,availableBeds:totalBedsNumber});
    
        bedsData = [];
    
        for(i=0;i<noofbedsperroom;i++){
            bedsData.push({
                bedNumber:i+1
            });
        }
    
        roomsarr.forEach(async(obj)=>{
            const roomsData = await roomsModel.create({
                type:type,
                floorNumber:floorno,
                roomNumber:obj,
                beds:bedsData
            })
        });
    
        res.status(200).json({floorData});
    }else{
        res.status(232).json({message:"floor already present add in special rooms"});
    }

});


const createSpecialRooms = asyncHandler(async(req, res) => {
    const { type, floorno, roomsarr, noofbedsperroom } = req.body;

    const floorData = await floorModel.findOne({ type: type, floorNumber: floorno });

    const newBedsNumber = (roomsarr.length * noofbedsperroom) + floorData.totalBeds;

    floorData.totalBeds = newBedsNumber;
    floorData.availableBeds = newBedsNumber;

    await floorData.save();

    const bedsData = [];

    for (let i = 0; i < noofbedsperroom; i++) {
        bedsData.push({
            bedNumber: i + 1
        });
    }

    let alreadyRooms = 0;

    for (const roomNumber of roomsarr) {
        const alreadyRoom = await roomsModel.findOne({ type: type, floorNumber: floorno, roomNumber: roomNumber });
        if (!alreadyRoom) {
            const roomsData = await roomsModel.create({
                type: type,
                floorNumber: floorno,
                roomNumber: roomNumber,
                beds: bedsData
            });
        } else {
            alreadyRooms++;
        }
    }

    res.status(200).json(alreadyRooms);
});



const bookedData = asyncHandler(async(req,res)=>{
    const bookedData = await bookedUsersModel.find();
    console.log(bookedData);
    res.status(200).json(bookedData);
})



module.exports = {createRooms,createSpecialRooms,bookedData};


