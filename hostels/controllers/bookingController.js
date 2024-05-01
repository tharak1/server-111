const asyncHandler = require("express-async-handler");
const roomsModel = require("../models/roomsModel");
const BookedUser = require("../models/bookedUsersModel");
const floorsModel = require("../models/floorsModel");

const bookRoom = asyncHandler(async(req, res) => {
    console.log("hello");
    let filter = {}

    if(req.query){
        filter = {type:req.query.type,roomNumber:req.query.roomno,floorNumber:req.query.floorno}
    }

    const {bedno,bookedBy,bookedById} = req.body;
    console.log(req.body);

    const userData = await BookedUser.findOne({adminId:bookedById});

    if(!userData){
        const room = await roomsModel.findOne(filter);

        const current = room.beds.find((item) => item.bedNumber === bedno);
        console.log(current);

        if(current){
            if (current.isBooked === false) {
                current.isBooked = true;
                current.bookedBy = bookedBy;
                current.bookedById = bookedById;
        
                // Save the updated room
                await room.save();
        
                const bookingdetails =  await BookedUser.create({adminId:bookedById,name:bookedBy,roomDetails:{
                    type:req.query.type,floorNumber:req.query.floorno,roomNumber:req.query.roomno,bedNumber:bedno
                }})
        
                const floor = await floorsModel.findOne({type:req.query.type,floorNumber:req.query.floorno});
                floor.availableBeds = floor.availableBeds-1;
                await floor.save();

        
        
        
                res.status(200).json(bookingdetails );
                // console.log(bookingdetails)
            } else {
                res.status(200).json({ message: "Bed already booked" });
                console.log({ message: "Bed already booked" })
            }
        }
        else{
            res.status(200).json({ message: "Bed not found" });
            console.log({ message: "Bed not found" })
        }
    

    }
    else{
        res.status(201).json({ message: "you have already booked" });
        console.log({ message: "you have already booked" })
    }
});


const findAlreadyBooked = asyncHandler(async(req,res)=>{
    const {bookedBy,bookedById} = req.body;
    const bookedUser = await BookedUser.findOne({adminId:bookedById,name:bookedBy});
    if(bookedUser){
        res.status(200).json(bookedUser);
    }
    else{
        res.status(248).json({message:"is not booked"});
    }
})

module.exports = {bookRoom,findAlreadyBooked};
