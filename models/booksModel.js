const mongoose = require("mongoose");

const booksSchema = mongoose.Schema({
    BookName:{
        type:String,
        required:true,
    },
    BookImageUrl:{
        type:String,
        required:true,
    },
    BookLinkUrl:{
        type:String,
        required:true,
    },
    BookAuthor:{
        type:String,
        required:true,
    },
    Regulation:{
        type:String,
        required:true,
    },
    Department:{
        type:String,
        required:true,
    }

});

booksSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

booksSchema.set('toJSON',{
    virtuals : true,
});


module.exports = mongoose.model("Book",booksSchema);