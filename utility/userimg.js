const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    destination:function (req,file,callback) {
        callback(null, "UploadUser")
    }
    ,filename:function (req,file,callback) {
        const ext = path.extname(file.originalname)
        callback(null, Date.now()+ext)
    }
})

const fileFilter = (req,file,callback)=>{
    if (
        file.mimetype.includes("jpg") || file.mimetype.includes("jpeg") || file.mimetype.includes("png")
    ) {
        callback(null, true)
    } else {
        callback(null, false)
        console.log("error in multer");
    }
}

const UserMulter = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fieldSize: 1024 * 1024 *5},
}).single("image")

module.exports=UserMulter