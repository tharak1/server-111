const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Book = require("../models/booksModel");
const asynchandler = require("express-async-handler");

const domain = process.env.DOMAIN;

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
        if (file.fieldname === "booksCover") {
            cb(null, './upload/booksCover/')
        }
        else if (file.fieldname === "booksPdf") {
            cb(null, './upload/booksPdf/');
        }
     },
    filename: (req, file, cb) => {

        if (file.fieldname === "booksCover") {
            return cb(null, `BOOKSCOVER${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)

        }
        else if (file.fieldname === "booksPdf") {
            return cb(null, `PDF${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        }
    }
})

const upload = multer({storage: storage,});

router.post("/upload", upload.fields([{name:'booksCover',maxC5ount:1},{name:'booksPdf',maxCount:1}]), asynchandler(async(req, res) => {
    const {booksname,department,regulation}=req.body;

    const file1 = req.files['booksCover'][0].filename;
    const file2 = req.files['booksPdf'][0].filename;
    const book = await Book.create({BookName:booksname,Department:department,Regulation:regulation,BookImageUrl:`${domain}/upload/booksCover/${file1}`,BookLinkUrl:`${domain}/upload/booksPdf/${file2}`,BookAuthor:"sai"});
    res.status(200).json(req.files);

    
}));

module.exports = router;