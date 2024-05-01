const asyncHandler = require("express-async-handler");

const Bus = require("../models/transportmodel");

const getAllBuses = asyncHandler(async (req, res) => {
      const buses = await Bus.find();
      res.status(200).json(buses);
  });
  
  const createBus = asyncHandler(async (req, res) => {
        const{Busno,Routeno,Routename,Routedesc,drivername,driverph,driverimage,startlocation,currentlocation,starttime,reachtime,Stoplocation}= req.body;
        const bus = await Bus.create({Routedesc,drivername,driverimage,Busno,Routeno,Routename,driverph,startlocation,currentlocation,starttime,reachtime,Stoplocation});
        res.status(200).json(bus);
  });

  const setLiveLocation = asyncHandler(async(req,res)=>{
      filter = {}
      if(req.query){
            filter = {Routeno:req.query.routeno}
      }
      const {LiveLocation} = req.body;
      const bus = await Bus.findOneAndUpdate(filter,{currentlocation:LiveLocation},{new:true});
      res.status(200).json(bus);

  })
  
  module.exports = {getAllBuses,createBus,setLiveLocation};