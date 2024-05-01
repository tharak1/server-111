const mongoose = require("mongoose");

const libraryBooksSchema = mongoose.Schema({
    BookId:{
        type:String,
        required:true,
    },
    BookName:{
        type:String,
        required:true,
    },
    BookImage:{
        type:String,
        required:true,
    },
    BookAuthor:{
        type:String,
        required:true,
    },
    BookEdition:{
        type:String,
        required:true,
    }

});

module.exports = mongoose.model("LibraryBooks",libraryBooksSchema);