const mongoose = require("mongoose");

const PrevQuestionPaperSchema = mongoose.Schema({
    SubjectName:{
        type:String,
        required:true,
    },
    Department:{
        type:String,
        required:true,
    },
    Regulation:{
        type:String,
        required:true,
    },
    PrevQuestionPaperAddress:{
        type:String,
        required:true,
    },
    PrevQuestionPaperUrl:{
        type:String,
        required:true,
    }
});

PrevQuestionPaperSchema.virtual('Id').get(function() {
    return this._id.toHexString();
});

PrevQuestionPaperSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model("PrevQuestionPaper",PrevQuestionPaperSchema);