const asynchandler = require("express-async-handler");
const Book = require("../models/booksModel");
//const { query } = require("express");

const createBook = asynchandler(async(req,res)=>{
    const {bookid,bookname,bookimageurl,bookdrivelink,bookrating,bookauthor,bookedition,category} = req.body;

    const newBook = await Book.create({bookid,bookname,bookimageurl,bookdrivelink,bookrating,bookauthor,bookedition,category});

    res.status(200).json(newBook);
});

const getAllBooks = asynchandler(async(req,res)=>{
    const books = await Book.find();
    res.status(200).json(books);
});

const getBooksForCategory = asynchandler(async(req,res)=>{
    let filter = {};
    if(req.query){
        const { regulation, department } = req.query;
        filter = {Regulation: { '$in': [ regulation, 'ALL' ]}, Department: { $in: [department, 'ALL'] }}
    }
    const book = await Book.find(filter);
    res.status(200).json(book);
});

module.exports = {createBook,getAllBooks,getBooksForCategory};