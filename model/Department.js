const mongoose = require("mongoose")

const DepartmentSchema = new mongoose.Schema({
    departmentName:{
        type:String,
        required:true,
    },
    doctor_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
    }],
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
})

const DepartmentModel = mongoose.model("department",DepartmentSchema)
module.exports=DepartmentModel