const mongoose = require("mongoose")

const AppointmentSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    department_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"department",
        required:true,
    },
    doctor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    isPending:{
        type:Boolean,
        default:false,
    },

},{timestamps:true})

const AppointmentModel = mongoose.model("appointment",AppointmentSchema)
module.exports=AppointmentModel