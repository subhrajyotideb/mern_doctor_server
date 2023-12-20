const mongoose = require("mongoose")

const DoctorSchema = new mongoose.Schema({
    department_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"department",
    },
    featured:{
        type:Boolean,
        default:false,
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    date: {
        type:Date,
        required:true,
    },
    aperture_time: {
        type:String,
        required:true,
    },
    departure_time: {
        type:String,
        required:true,
    },
},{timestamps:true})

const DoctorModel = mongoose.model("doctor",DoctorSchema)
module.exports=DoctorModel