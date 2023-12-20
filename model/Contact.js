const mongoose = require("mongoose")

const ContactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    topic:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    msg:{
        type:String,
        required:true,
    },
})

const ContactModel = mongoose.model("contact_u",ContactSchema)
module.exports=ContactModel