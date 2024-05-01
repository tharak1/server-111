const mongoose = require("mongoose");

const circularsSchema = mongoose.Schema({
    circularTitle:{
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
    CircularUrl:{
        type:String,
        required:true,
    }
});

circularsSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

circularsSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model("Circular",circularsSchema);