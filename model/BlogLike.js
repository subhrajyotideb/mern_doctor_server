const mongoose = require("mongoose")

const BlogLikeSchema = new mongoose.Schema({
    blog_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog",
    },
    user_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    like:{
        type:Boolean,

    },
})

const BlogLikeModel = mongoose.model("blog_like",BlogLikeSchema)
module.exports=BlogLikeModel