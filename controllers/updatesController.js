const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Updates = require("../models/updatesModel");
const asyncHandler = require("express-async-handler");
// const { route } = require("./updatesController");

const domain = process.env.DOMAIN;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "images") {
            cb(null, './upload/UpadteImages/');
        } else if (file.fieldname === "pdfs") {
            cb(null, './upload/UpdatePdfs/');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/upload", upload.fields([{ name: 'images' }, { name: 'pdfs' }]), asyncHandler(async(req, res) => {
    const { Regulation, Department, Section, Message, SentBy,Title} = req.body;

    let imagesUrls = [];
    let pdfUrls = [];

    if (req.files['images']) {
        imagesUrls = req.files['images'].map(file => `${domain}/upload/UpadteImages/` + file.filename);
    }

    if (req.files['pdfs']) {
        pdfUrls = req.files['pdfs'].map(file => `${domain}/upload/UpdatePdfs/` + file.filename);
    }

    const update = await Updates.create({
        Regulation,
        Department,
        Section,
        Message,
        ImagesUrl: imagesUrls,
        PdfUrl: pdfUrls,
        SentBy,
        Title
    });

    res.status(200).json({ message: 'Files uploaded successfully', update });
}));


router.get("/getUpdates",asyncHandler(async(req,res)=>{
    filter = {};
    if(req.query){
        const { regulation, department,section} = req.query;
        filter = { Regulation: { $in: [regulation, 'ALL'] }, Department: { $in: [department, 'ALL'] } , Section: { $in: [section, 'ALL'] }};
    }
    const response = await Updates.find(filter);

    res.status(200).json(response);
}));

router.post("/getUpdatesForSpecificFaculty",asyncHandler(async(req,res)=>{
    filter = {}

    const {name,id} = req.body;


    const updates = await Updates.find({SentBy:`${name} - ${id}`});

    res.status(200).json(updates);

}));

router.delete("/deleteUpdate/:id",asyncHandler(async(req,res)=>{

    const deleted = await Updates.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: 'Update not found' });
    }
    res.status(200).json({ message: 'Update deleted successfully' });
}));



module.exports = router;
