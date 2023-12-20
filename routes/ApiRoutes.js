const Route = require("express").Router()
const ApiController = require("../controller/ApiController")
const UserImg = require("../utility/userimg")
const {UserVerifyToken} = require("../middleware/AuthVerify")

// Admin and User Registration
Route.post("/register",UserImg,ApiController.CreateUser)

// User Login
Route.post("/login",ApiController.UserLogin)

// Contact Us create
Route.post("/createcontact",ApiController.CreateContact)

// Get All Doctor and Their Department Details
Route.get("/alldoctordepartment",ApiController.GetAllDoctorandDepartment)

// Get All Departments
Route.get("/alldepartment",ApiController.GetAllDepartment)

// Get Department Id Wise Doctors
Route.get("/departmentidwisedoctor/:id",ApiController.GetDepartmentWiseDoctors)

// Create Appointment
Route.post("/createappointment",UserVerifyToken,ApiController.CreateAppointment)

// Get Featured Doctors
Route.get("/featured",ApiController.GetFeaturedDoctors)

// Get Single Doctor Details
Route.get("/doctordetails/:id",ApiController.GetSingleDoctor)

// Get All Blog
Route.get("/allblog",ApiController.GetAllBlog)

// Get Single Blog
Route.get("/singleblog/:id",ApiController.GetSingleBlog)

// Get Personal Care Doctors
Route.get("/personalcare",ApiController.GetPersonalCareDoctors)

// Get Child Care Doctors
Route.get("/childcare",ApiController.GetChildCareDoctors)

// Create Blog Comment
Route.post("/createblogcomment",UserVerifyToken,ApiController.CreateBlogComment)

// Get Blog Comment
Route.get("/getblogcomment/:id",ApiController.GetBlogComment)

// Get User Dashboard
Route.get("/userdash/:id",UserVerifyToken,ApiController.GetUserDashBoard)

// Get Recent Blog
Route.get("/recentblog",ApiController.GetRecentBlogs)

// Searched Blog
Route.get("/blogsearch/:key",ApiController.SearchBlog)

module.exports=Route