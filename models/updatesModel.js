const mongoose = require("mongoose");

const UpdtesSchema = mongoose.Schema({
    Regulation:{
        type:String,
        required:true,
    },
    Department:{
        type:String,
        required:true,
    },
    Section:{
        type:String,
        required:true,
    },
    Message:{
        type:String,
        required:true,
    },
    ImagesUrl:[{
        type:String,
    }],
    PdfUrl:[{
        type:String,
    }],
    SentBy:{
        type:String,
        required:true,
    },
    Title:{
        type:String,
        required:true,
    },
    created_at: { type: Date, default: Date.now },
});

UpdtesSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

UpdtesSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Updates', UpdtesSchema);
