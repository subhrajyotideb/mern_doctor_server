const UserModel = require("../model/User")
const BlogModel = require("../model/Blog")
const DepartmentModel = require("../model/Department")
const DoctorModel = require("../model/Doctor")
const ContactModel = require("../model/Contact")
const AppointmentModel = require("../model/Appointment")

const bcrypt = require("bcryptjs")
const {CreateAdminToken} = require("../middleware/AuthHelper")



// Get Admin Dashboard
exports.AdminDashboard = async (req,res)=>{
    try {

         // All User
         const AllUser = await UserModel.aggregate([
            {
                $match:{
                    isAdmin:false,
                }
            }
        ])
        const AllUserData = AllUser.length

        // All Blogs
        const AllBlog = await BlogModel.countDocuments()
        
        // All Doctor
        const AllDoctor = await DoctorModel.countDocuments()

        // All Pending Appointment
        const AllPendApp = await AppointmentModel.aggregate([
            {
                $match:{
                    isPending:false,
                }
            }
        ])
        const PendingApp = AllPendApp.length

        // All Departments
        const AllDepartment = await DepartmentModel.countDocuments()

        // All Contact
        const AllContact = await ContactModel.countDocuments()

        // All Featured Doctor
        const AllFeDoctor = await DoctorModel.aggregate([
            {
                $match:{
                    featured:true,
                },
            }
        ])
        const AllFeaturedDoctor = AllFeDoctor.length


        return res.render("dashboard",{
            AllUserData:AllUserData,
            AllBlog:AllBlog,
            AllDoctor:AllDoctor,
            PendingApp:PendingApp,
            AllDepartment:AllDepartment,
            AllContact:AllContact,
            AllFeaturedDoctor:AllFeaturedDoctor,
        })
    }
    catch (error) {
        console.log(error);
    }
}


// Get Admin Login Page
exports.AdminLogin = (req,res)=>{
    res.render("login",{message:req.flash("message")})
}


// Get (Profile) page
exports.AdminProfile = async (req, res) => {
    try {
        const result = await UserModel.findById(req.admin._id);
        const image = await UserModel.findById(req.admin.image);

        res.render("adminprofile", {
            data: result,
            image: image
        });

        console.log(image);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


// Get View Blog Page
exports.Blog = async (req,res)=>{
    const result = await BlogModel.find()
    res.render("blog",{data:result, message:req.flash("message")})
}


// Get Create Blog Page
exports.AddBlog = (req,res)=>{
    res.render("blogadd")
}

// Get edit Blog Page
exports.EditBlog = async (req,res)=>{
    const id = req.params.id
    const result = await BlogModel.findById({_id:id})
    res.render("blogedit",{data:result})
}

// Get View Department Page
exports.Department = async (req,res)=>{
    const result = await DepartmentModel.find()
    res.render("department",{data:result})
}

// Get Create Department Page
exports.AddDepartment = (req,res)=>{
    res.render("departadd")
}

// Get Edit Department Page
exports.EditDepartment = async (req,res)=>{
    const id = req.params.id
    const result = await DepartmentModel.findById({_id:id})
    res.render("departedit",{data:result})
}

// Get View Doctor Page
exports.Doctor = async (req, res) => {
    try {
        const result = await DoctorModel.aggregate([
            {
                $lookup: {
                    from: "departments",
                    localField: "department_id",
                    foreignField: "_id",
                    as: "department_details"
                }
            }
        ]);

        // Assuming result is an array of doctors with their department_details
        // console.log(result[0].department_details);

        res.render("doctor", { data: result });
    } catch (error) {
        console.log(error);
    }
};


// Get Create Doctor Page
exports.AddDoctor = async (req,res)=>{
    const result = await DepartmentModel.find()
    const message = req.flash("message")
    res.render("doctoradd",{
        data : result,
        message : message,
    })
}


// Get Appintment Approval Page
exports.Appointment = async (req, res) => {
    try {
      const result = await AppointmentModel.aggregate([
        {
          $lookup: {
            from: "doctors",
            localField: "doctor_id",
            foreignField: "_id",    
            as: "doctor_details",
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "department_id",
            foreignField: "_id",
            as: "department_details",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user_details",
          },
        },
      ]);
  
      res.render("appointment", { data: result });
    //   console.log(data);
      
    } catch (error) {
      console.log(error);
    }
};
  

// Admin Login
exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash("message", "Both Email and Password Required");
            return res.redirect("/admin/");
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            req.flash("message", "Incorrect Email or Password");
            return res.redirect("/admin/");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch && (user.isAdmin == true)) {
            const token = await CreateAdminToken({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
            });

            res.cookie("adminToken", token);
            return res.redirect("/admin/dashboard");
        } else {
            req.flash("message", "Incorrect Email or Password");
            return res.redirect("/admin/");
        }
    } catch (error) {
        console.error(error);
        req.flash("message", "Check Your Email and Password");
        res.redirect("/admin/");
    }
}


// Admin Logout
exports.AdminLogout = (req,res)=>{
    res.clearCookie("adminToken");
    res.redirect("/admin/");
}

// Create Blog
exports.CreateBlog = async (req,res)=>{
    try {
        const {title,description} = req.body
        const image = req.file.path
        const NewBlog = await new BlogModel({
            title:title,
            description:description,
            image:image,
        })

        await NewBlog.save()
        req.flash("message", "New Blog Added")
        return res.redirect("/admin/blog")
        
    }
    catch (error) {
        console.log(error);
        res.redirect("/admin/addblog")
    }
}

// Update Blog
exports.UpdateBlog = async (req,res)=>{
    try {

        const {title,description} = req.body
        const image = req.file.path

        const id = req.params.id
        const Update = await BlogModel.findById({_id:id})

        Update.title = title,
        Update.description = description,
        Update.image = image

        await Update.save()
        req.flash("message", "Blog Updated")
        res.redirect("/admin/blog")

    }
    catch (error) {
        console.log(error);
        res.redirect("/admin/editblog/${id}")
    }
}

// Delete Blog
exports.DeleteBlog = async (req,res)=>{
    try {}
    catch (error) {

    }
}

// Create Department
exports.CreateDepartment = async (req,res)=>{
    try {
        const {departmentName,description} = req.body
        const image = req.file.path

        const existingDep = await DepartmentModel.findOne({departmentName:departmentName})

        if (existingDep) {
            req.flash("message", "Department Already Exist")
            res.redirect("/admin/adddepartment")
        } else {
            const NewDepartment = await new DepartmentModel({
                departmentName:departmentName,
                description:description,
                image:image,
            })
            await NewDepartment.save()
            req.flash("message", "New Department Added")
            res.redirect("/admin/department")
        }

        
    }
    catch (error) {
        console.log(error);
        res.redirect("/admin/department");
    }
}

// Update Department
exports.UpdateDepartment = async (req, res) => {
    try {
        const { departmentName, description } = req.body;
        const image = req.file.path

        const id = req.params.id;

        const Update = await DepartmentModel.findById({_id:id});

        if (!Update) {
            req.flash("error", "Department not found");
            return res.redirect("/admin/department");
        }

        Update.departmentName = departmentName;
        Update.description = description;
        Update.image = image;

        await Update.save();

        req.flash("message", "Department Updated");
        res.redirect("/admin/department");

    } catch (error) {
        console.log(error);
        res.redirect("/admin/editdepartment");
    }
};


// Delete Department
exports.DeleteDepartment = async (req,res)=>{
    try {}
    catch (error) {
        
    }
}

// Create Doctor
exports.CreateDoctor = async (req, res) => {
    try {
        const { department_id, name, description, date, aperture_time, departure_time } = req.body;
        const image = req.file.path;

        // const duplicate = await DoctorModel.findOne({
        //     $or: [
        //         { department_id: department_id },
        //         { name: name }
        //     ]
        // });
        // if (duplicate) {
        //     console.log("===> Duplicate data not accepted");
        //     req.flash("message","Duplicate data not accepted");

        //     return res.redirect("/admin/adddoctor");
            
        // }

        const newDoctor = new DoctorModel({
            department_id: department_id,
            name: name,
            description: description,
            image: image,
            date: date,
            aperture_time: aperture_time,
            departure_time: departure_time,
        });

        const Doctor = await newDoctor.save();

        const Dep = await DepartmentModel.findById(department_id)
        // after department found by the id, its time to save 
        Dep.doctor_id.push(Doctor._id)

        const result = await Dep.save()

        // Step 2 :-
        // const result = await DestinationModel.findByIdAndUpdate(
        //     destination_Id,
        //     { $push: { title_id: DesTitle._id } },
        //     { new: true }
        // );

        req.flash("message", "New Doctor Added");
        return res.redirect("/admin/doctor");
    } catch (error) {
        console.log(error);
        req.flash("message", "Error adding new doctor");
        return res.redirect("/admin/adddoctor");
    }
};


// Get Edit Doctor Page
exports.EditDoctor = async (req,res)=>{
    const id = req.params.id
    const departments = await DepartmentModel.find()
    const result = await DoctorModel.findById({_id:id}).populate("department_id")
    res.render("doctoredit",{data:result, data2:departments})
    console.log(result);
}


// Update Doctor
exports.UpdateDoctor = async (req, res) => {
    try {
        const { department_id, name, description } = req.body;
        const image = req.file.path;
        const id = req.params.id

        // Check if there is an existing doctor with the same department_id or name
        const duplicate = await DoctorModel.findOne({
            $and: [
                { _id: { $ne: id } }, // Exclude the current doctor being updated
                {
                    $or: [
                        { department_id: department_id },
                        { name: name }
                    ]
                }
            ]
        });

        if (duplicate) {
            req.flash("message", "Duplicate data not accepted");
            return res.redirect(`/admin/editdoctor/${id}`);
        }

        // Find the doctor to update
        const doctorToUpdate = await DoctorModel.findById(id);

        if (!doctorToUpdate) {
            req.flash("message", "Doctor not found");
            return res.redirect("/admin/doctor");
        }

        // Update the doctor's information
        doctorToUpdate.department_id = department_id;
        doctorToUpdate.name = name;
        doctorToUpdate.description = description;
        doctorToUpdate.image = image;

        await doctorToUpdate.save();

        req.flash("message", "Doctor updated successfully");
        return res.redirect("/admin/doctor");
    } catch (error) {
        console.log(error);
        req.flash("message", "Error updating doctor");
        return res.redirect("/admin/doctor");
    }
};


// Appointment Approve Button Controller
exports.AppointmentApproveButton = async (req, res) => {
    try {
      const id = req.params.id; // Corrected parameter name
      const status = await AppointmentModel.findById({ _id: id });
  
      if (!status) {
        return res.status(404).json({
          status: false,
          message: "Appointment not found",
        });
      }
  
      status.isPending = !status.isPending; // Toggle the value
  
      await status.save();
      return res.redirect("/admin/appointment");
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "An error occurred while updating appointment status.",
      });
    }
};
  
  
// Get Contact Us page
exports.GetContact = async (req,res)=>{
    try {
        const result = await ContactModel.find()
        return res.render("contact",{
            data:result,
        })
    }
    catch (error) {
        console.log(error);
    }
}

// Get Doctor Featured Page
exports.Featured = async (req,res)=>{
    try {
        const result = await DoctorModel.aggregate([{
            $lookup:{
                from:"departments",
                localField:"department_id",
                foreignField:"_id",
                as:"department_details"
            }
        }])
        res.render("featured",{data:result})
    }
    catch (error) {
        console.log(error);
    }
}


// Featurd Button Controller
exports.FeaturedButton = async (req, res) => {
    try {
        const id = req.params.id;
        const status = await DoctorModel.findById({ _id: id });

        if (status.featured === false) {
            
            status.featured = true;
        } else {
            
            status.featured = false;
        }

        await status.save();
        return res.redirect("/admin/featured");

    } catch (error) {
        console.log(error);
        res.redirect("/admin/featured");
    }
};



// Test
exports.Test = async (req, res) => {
    try {
      const result = await AppointmentModel.aggregate([
        {
          $lookup: {
            from: "doctors",
            localField: "doctor_id",
            foreignField: "_id",
            as: "doctor_details",
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "department_id",
            foreignField: "_id",
            as: "department_details",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user_details",
          },
        },
      ]);
  
      res.status(200).json({
        status: true,
        message: "Appointment data fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "An error occurred while fetching appointment data.",
      });
    }
};