const asyncHandler = require("express-async-handler");
const Library = require("../models/libraryModel");
const Book = require("../models/booksModel");
const librarybooksModel = require("../models/librarybooksModel");






function getCurrentTimestamp() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const milliseconds = String(currentDate.getMilliseconds()).padStart(6, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

  return formattedDate;
}
















const createLibrary = asyncHandler(async(req,res)=>{
    const lib = await Library.create(req.body);
    res.status(200).json(lib);
});

const booksget = asyncHandler(async(req,res)=>{
    const currentUser = await Library.findOne({RollNo:req.user.roolno});
    const bookIds = currentUser.booksTaken;
    const finalBooksObj = await librarybooksModel.find({ BookId: { $in: bookIds } });
    res.status(200).json(finalBooksObj);
});

const getLib = asyncHandler(async(req,res)=>{
    const currentUser = await Library.findOne({RollNo:req.user.roolno});
    res.status(200).json(currentUser);
})


const addToLibrary = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.query) {
      filter = { RollNo: req.query.rollno };
    }
    const { bookId } = req.body;
  
    const current = await Library.findOne(filter);
  
    if (!current) {
      const currentDate = getCurrentTimestamp();
      // If the document doesn't exist, create a new one and add the bookId to it
      await Library.findOneAndUpdate(
        filter,
        {
          $set: {
            RollNo: req.query.rollno, // Add other necessary fields here
          },
          $push: {
            booksTaken: bookId,
            dateTaken: getCurrentTimestamp(),
          },
        },
        { upsert: true, new: true }
      );
      res.status(200).json("success");
    } else {
      // If the document exists, check if the bookId already exists in the array
      if (!current.booksTaken.includes(bookId)) {
        // If not, add the bookId and the current date to the arrays
        const currentDate = new Date();
        await Library.findOneAndUpdate(
          filter,
          {
            $push: {
              booksTaken: bookId,
              dateTaken: getCurrentTimestamp(),
            },
          },
          { new: true }
        );
        res.status(200).json("success");
      } else {
        // If the bookId already exists, return an error
        res.status(400).json({ message: "book already exists" });
      }
    }
  });


  const removeFromLibrary = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.query) {
      filter = { RollNo: req.query.rollno };
    }
    const { bookId } = req.body;
    const current = await Library.findOne(filter);
    let arr = current.booksTaken;
    let timearr = current.dateTaken; 
    console.log("here in remove");
    for(let i=0;i<current.booksTaken.length;i++){
        if (current.booksTaken[i] === bookId){
            arr.splice(i,1);
            timearr.splice(i,1);
        }
    }
    const final  = await Library.findOneAndUpdate(filter,{booksTaken:arr,dateTaken:timearr},{new:true});
    res.status(200).json(final);
  });
  


const updateDate = asyncHandler(async(req,res)=>{
    let filter = {};
    if (req.query) {
    filter = { RollNo: req.query.rollno };
    }
    
    const { bookId } = req.body;
    const current = await Library.findOne(filter);
    console.log(current);
    let timearr = current.dateTaken; 
    const currentDate = new Date();
    if(current.booksTaken.length>0){
        if(current.booksTaken.includes(bookId)){

            for(let i=0;i<current.booksTaken.length;i++){
                if (current.booksTaken[i] === bookId){
                    timearr[i] = currentDate;
                }
            }
            const final  = await Library.findOneAndUpdate(filter,{dateTaken:timearr},{new:true});
            res.status(200).json(final);
        }
        else{
            res.status(400).json({message:"book is not present"});
        }
    }else{
        res.status(400).json({message:"no books are present"});
    }
});


const addLibBooks = asyncHandler(async(req,res)=>{
    const libbook = await librarybooksModel.create(req.body);
    res.status(200).json(libbook);
});

const getBooks = asyncHandler(async(req,res)=>{
    const {bookarr} = req.body

});

module.exports = {createLibrary,booksget,getLib,addToLibrary,removeFromLibrary,updateDate,addLibBooks};
