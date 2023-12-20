const express = require("express")
const app = express()
require("dotenv").config()
const bodyparser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")
const cookie = require("cookie-parser")
const MongoDB = require("./config/db")
const ejs = require("ejs")
const path = require("path")
const cors = require("cors")

// cors for react
app.use(cors())

// express-session
app.use(session({
    cookie:{
        maxAge:60000
    },
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
}))

// cookie-parser
app.use(cookie())

// connect-flash
app.use(flash())

// body parser
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

// set up ejs file to the view engine
app.set("view engine","ejs")
app.set("views","views")

// static directory
app.use(express.static(path.join(__dirname,"public")));

// blog image upload folder
app.use("/uploadBlog",express.static(path.join(__dirname,"UploadBlog")))

// department image upload folder
app.use("/uploadDepartment",express.static(path.join(__dirname,"UploadDepartment")))

// user image upload folder
app.use("/uploadUser",express.static(path.join(__dirname,"UploadUser")))

// doctor image upload folder
app.use("/uploadDoctor",express.static(path.join(__dirname,"UploadDoctor")))

// admin routes
const AdminRoutes = require("./routes/AdminRoutes")
app.use("/admin",AdminRoutes)

// api routes
const ApiRoutes = require("./routes/ApiRoutes")
app.use(ApiRoutes)

// define port
const port = process.env.PORT || 7854

// MongoDB connection
MongoDB()

// create server
app.listen(port,()=>{
    console.log(`server is running on port http://localhost:${port}`);
})