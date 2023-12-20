const mongoose = require("mongoose")

const BlogCommentSchema = new mongoose.Schema({
    blog_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog",
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    comment:{
        type:String,
        
    },
},{timestamps:true})

const BlogCommentModel = mongoose.model("blog_comment",BlogCommentSchema)
module.exports=BlogCommentModel