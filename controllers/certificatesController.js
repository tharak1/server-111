const express = require("express");
const multer = require("multer");
const router = express.Router();
const asynchandler = require("express-async-handler");
const cerificatesModel = require("../models/cerificatesModel");
const domain = process.env.DOMAIN;

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
            cb(null, './upload/certificates');
     },
    filename: (req, file, cb) => {
            return cb(null, `${file.originalname}`);
    }
})

// return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);

const upload = multer({storage: storage,});

router.post("/upload", upload.single('certificatePdf'), asynchandler(async(req, res) => {
    const {rollno,department,regulation,section,certificationBy,course,name}=req.body;


    const TimeTablea = await cerificatesModel.findOne({RollNo:rollno,Name:name});
    if(TimeTablea){
        res.status(400).json({message:"already exists"});
    }
    else{
        const file1 = req.file;
        const TimeTableRes = await cerificatesModel.create({RollNo:rollno,Department:department,Regulation:regulation,Section:section,CertificationBy:certificationBy,Course:course,Name:name,CertificateAddress:`upload/certificates/${file1.filename}`,CertificateUrl:`${domain}/upload/certificates/${file1.filename}`});
        res.status(200).json({message:"uploaded successfully"});
    }
},),);

router.get("/getCertificates",asynchandler(async(req,res)=>{
    filter = {};
    if(req.query){
        const {rollno} = req.query;
        filter = {RollNo:rollno};
    }
    const response = await cerificatesModel.find(filter);

    res.status(200).json(response);
}))

router.delete("/deleteCertificate/:id",asynchandler(async(req,res)=>{

    const deleted = await cerificatesModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: 'Update not found' });
    }
    res.status(200).json({ message: 'Update deleted successfully' });
}));





module.exports = router;