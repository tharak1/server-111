const mongoose = require("mongoose");

const CertificatesSchema = mongoose.Schema({
    RollNo:{
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
    Section:{
        type:String,
        required:true,
    },
    Name:{
        type:String,
        required:true,
    },
    CertificationBy:{
        type:String,
        required:true,
    },
    Course:{
        type:String,
        required:true,
    },
    CertificateUrl:{
        type:String,
        required:true,
    },
    CertificateAddress:{
        type:String,
        required:true,
    }
});

CertificatesSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

CertificatesSchema.set('toJSON',{
    virtuals : true,
});


module.exports = mongoose.model("CertificatesModel",CertificatesSchema);