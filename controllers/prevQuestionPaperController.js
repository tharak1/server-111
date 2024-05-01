const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const asynchandler = require("express-async-handler");
const prevQpapreModel = require("../models/prevQpapreModel");
const domain = process.env.DOMAIN;

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
            cb(null, './upload/prevQp');
     },
    filename: (req, file, cb) => {
            return cb(null, `${file.originalname}`);
    }
})

// return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);

const upload = multer({storage: storage,});

router.post("/upload", upload.single('prevQPPdf'), asynchandler(async(req, res) => {
    const {prevQPname,department,regulation}=req.body;


    const prevQP = await prevQpapreModel.findOne({SubjectName:prevQPname,Department:department,Regulation:regulation});
    if(prevQP){
        res.status(400).json({message:"already exists"});
    }
    else{
        const file1 = req.file;
        const prevQPRes = await prevQpapreModel.create({SubjectName:prevQPname,Department:department,Regulation:regulation,PrevQuestionPaperAddress:`upload/prevQp/${file1.filename}`,PrevQuestionPaperUrl:`${domain}/upload/prevQp/${file1.filename}`});
        const hello = `upload/timetable/${file1.filename}`;
        res.status(200).json(prevQPRes);
    }
}));

router.get("/getPrevQP",asynchandler(async(req,res)=>{
    filter = {};
    if(req.query){
        const { regulation, department } = req.query;
        filter = { Regulation: regulation, Department: department };
    }
    const response = await prevQpapreModel.find(filter);

    res.status(200).json(response);
}));



module.exports = router;