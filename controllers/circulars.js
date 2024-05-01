const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Circular = require("../models/circularModel");
const asynchandler = require("express-async-handler");
const { log } = require("console");

const domain = process.env.DOMAIN;

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
            cb(null, './upload/circulars');
     },
    filename: (req, file, cb) => {
            return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({storage: storage,});

router.post("/upload", upload.single('circularPdf'), asynchandler(async(req, res) => {
    const {circularname,department,regulation}=req.body;
    const file1 = req.file;
    const circular = await Circular.create({circularTitle:circularname,Department:department,Regulation:regulation,CircularUrl:`${domain}/upload/circulars/${file1.filename}`});
    res.status(200).json(circular);
}));


router.get("/getCirculars",asynchandler(async(req,res)=>{
    filter = {};
    if(req.query){
        const { regulation, department } = req.query;
        filter = { Regulation: { $in: [regulation, 'ALL'] }, Department: { $in: [department, 'ALL'] } };
    }
    const response = await Circular.find(filter);

    res.status(200).json(response);
}))


module.exports = router;