const Route = require("express").Router()
const AdminController = require("../controller/AdminController")
const {AdminVerifyToken} = require("../middleware/AuthVerify")
const DepartmentMulter = require("../utility/departmentimg")
const DoctorMulter = require("../utility/doctorimg")
const BlogMulter = require("../utility/blogimg")

//                    // Render All Pages //
Route.get("/",AdminController.AdminLogin)
Route.get("/logout",AdminController.AdminLogout)
Route.get("/dashboard",AdminVerifyToken,AdminController.AdminDashboard)
Route.get("/profile",AdminVerifyToken,AdminController.AdminProfile)
Route.get("/appointment",AdminVerifyToken,AdminController.Appointment)
Route.get("/approve/:id",AdminVerifyToken,AdminController.AppointmentApproveButton)
// Department
Route.post("/createdepartment",DepartmentMulter,AdminVerifyToken,AdminController.CreateDepartment)
Route.get("/department",AdminVerifyToken,AdminController.Department)
Route.get("/adddepartment",AdminVerifyToken,AdminController.AddDepartment)
Route.get("/editdepartment/:id",AdminVerifyToken,AdminController.EditDepartment)
Route.post("/updatedepartment/:id",DepartmentMulter,AdminVerifyToken,AdminController.UpdateDepartment)
// Blog
Route.get("/blog",AdminVerifyToken,AdminController.Blog)
Route.get("/addblog",AdminVerifyToken,AdminController.AddBlog)
Route.get("/editblog/:id",AdminVerifyToken,AdminController.EditBlog)
Route.post("/createblog",BlogMulter,AdminVerifyToken,AdminController.CreateBlog)
Route.post("/updateblog/:id",BlogMulter,AdminVerifyToken,AdminController.UpdateBlog)
Route.get("/deleteblog/:id", AdminVerifyToken, AdminController.DeleteBlog);


// Doctor
Route.get("/doctor",AdminVerifyToken,AdminController.Doctor)
Route.get("/adddoctor",AdminVerifyToken,AdminController.AddDoctor)
Route.get("/editdoctor/:id",AdminVerifyToken,AdminController.EditDoctor)
Route.post("/createdoctor",DoctorMulter,AdminVerifyToken,AdminController.CreateDoctor)
Route.post("/updatedoctor/:id",DoctorMulter,AdminVerifyToken,AdminController.UpdateDoctor)
Route.get("/deletedoctor/:id", AdminVerifyToken, AdminController.DeleteDoctor);

// Featured Doctor
Route.get("/featured",AdminVerifyToken,AdminController.Featured)
Route.get("/fbutton/:id",AdminVerifyToken,AdminController.FeaturedButton)
// Contact Us Details
Route.get("/contact",AdminVerifyToken,AdminController.GetContact)
Route.get("/deletecontact/:id", AdminVerifyToken, AdminController.DeleteContact);


                    // Admin Login //
Route.post("/login",AdminController.Login)




// Test
Route.get("/test",AdminController.Test)



module.exports=Route