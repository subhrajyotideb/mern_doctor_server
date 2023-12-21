const UserModel = require("../model/User")
const DoctorModel = require("../model/Doctor")
const AppointmentModel = require("../model/Appointment")
const ContactModel = require("../model/Contact")
const DepartmentModel = require("../model/Department")
const BlogModel = require("../model/Blog")
const BlogCommentModel = require("../model/BlogComment")

const {SecurePassword,SecureForget,CreateUserToken} = require("../middleware/AuthHelper")
const bcrypt = require("bcryptjs")
const crypto = require("crypto");
const nodemailer = require("nodemailer")



// Create User
// exports.CreateUser = async (req, res) => {
//     try {
//         const { name, email, phone, password, forget } = req.body;

//         // Check if email or phone already exists
//         const existingUser = await UserModel.findOne({ $or: [{ email: email }, { phone: phone }] });

//         if (existingUser) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Email or phone already exists. Please use a different email or phone.",
//             });
//         }

//         const Hashpassword = await SecurePassword(password);
//         const Hashforget = await SecureForget(forget)
//         const image = req.file.path;

//         const NewUser = new UserModel({
//             name: name,
//             email: email,
//             phone: phone,
//             password: Hashpassword,
//             image: image,
//             forget: Hashforget,
//         });

//         const result = await NewUser.save();
//         res.status(200).json({
//             status: 200,
//             message: "User Registration successful",
//             data: result,
//         });
//     } catch (error) {
//         res.status(400).json({
//             status: 400,
//             message: "Error in User Registration",
//         });
//         console.log(error);
//     }
// };


exports.CreateUser = async (req, res) => {
    try {
        const { name, email, phone, password, forget } = req.body;

        const Hashpassword = await SecurePassword(password);
        const Hashforget = await SecureForget(forget)
        const image = req.file.path;

        // Check if email or phone already exists
        const existingUser = await UserModel.findOne({ $or: [{ email: email }, { phone: phone }] });

        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: "Email or phone already exists. Please use a different email or phone.",
            });
        }


        const NewUser = new UserModel({
            name: name,
            email: email,
            phone: phone,
            password: Hashpassword,
            image: image,
            forget: Hashforget,
            token: crypto.randomBytes(16).toString('hex')

        });

        const result = await NewUser.save();

        const tokenSaved = result.token
        const emailSaved = result.email

        if (tokenSaved) {
            const transPorter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "subhrajyotidebnath19@gmail.com",
                    pass: "iiue bnux wyid iqgd",
                }
            });
            
            const mailOptions={
                from: 'mailto:no-reply@subhrajyoti.com',
                to: emailSaved,
                subject: 'Account Verification',
                text: 'Hello ' + name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + '\/' + encodeURIComponent(tokenSaved) + '\n\nThank You!\n' 
            }
            transPorter.sendMail(mailOptions);
            return res.status(200).json({
                success:true,
                message:"verification link sent!",
                data: result,
            })
           }

    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Error in User Registration",
        });
        console.log(error);
    }
};

// Confirm 
exports.Confirmation = async (req, res) => {
    try {
        const token_id = req.params.token;
        const user = await UserModel.findOne({ token: token_id });

        if (!user || !user.email || !user.token) {
            return res.status(400).json({
                status: false,
                message: "Token has expired or is invalid.",
            });
        } else if (user.isVerified === true) {
            return res.render("alreadyregistered")
        } else {
            // Update user.isVerified to true
            user.isVerified = true;

            // Save the updated user
            await user.save();

            return res.render("verificationpage",{
                data:user.name,
            })
        }
    } catch (error) {
        console.error("Error in confirmation:", error);
        return res.status(500).json({
            status: false,
            message: "Error in confirmation.",
        });
    }
};

// Login User
exports.UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({
                status: 400,
                message: "Email and Password both required",
            });
        }

        const user = await UserModel.findOne({ email: email }); 
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Wrong Email!",
            });
        }

        if (user.isVerified===false) {
            return res.status(400).json({
                status: 400,
                message: "User not verified!",
            });
        }


        if (user.isAdmin === false && (await bcrypt.compare(password, user.password))) {
            const token = await CreateUserToken({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
            });
            return res.status(200).json({
                status: 200,
                message: "User Login Successful",
                token:token,
                data:user,
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: "Wrong Email and Password",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Error in User Login",
        });
    }
};

// Get All Blog
exports.GetAllBlog = async (req, res) => {
    try {

        const result = await BlogModel.find()
            

        res.status(200).json({
            status: true,
            message: "All Blog Fetched",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Error in Blog Fetch",
        });
    }
};

// Get Single Blog
exports.GetSingleBlog = async (req, res) => {
    try {
      const id = req.params.id;
  
      const result = await BlogModel.findById({ _id: id });
  
      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Blog not found",
        });
      }
  
      res.status(200).json({
        status: true,
        message: "Single Blog Fetched",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Error in fetching single blog",
      });
    }
};

// Get Doctor and Department
exports.GetAllDoctorandDepartment = async (req,res)=>{
    try {
        const result = await DoctorModel.aggregate([
            {
                $lookup:{
                    from:"departments",
                    localField:"department_id",
                    foreignField:"_id",
                    as:"department_details",
                }
            }
        ])

        res.status(200).json({
            status:true,
            message:"Doctor and Department Fetched",
            data:result,
        })
    }
    catch (error) {
        res.status(400).json({
            status:false,
            message:"Could not Fetch Doctor and Department"
        })
    }
}

// Get All Departments
exports.GetAllDepartment = async (req,res)=>{
    try {
        const result = await DepartmentModel.find()

        res.status(200).json({
            status:true,
            message:"All Department Fetched",
            data:result,
        })
    }
    catch (error) {
        res.status(400).json({
            status:false,
            message:"Error in All Department Fetch"
        })
    }
}

// Create Appointment
exports.CreateAppointment = async (req, res) => {
    try {
      const { user_id, department_id, doctor_id, phone, message } = req.body;
  
      // Check for an existing pending appointment with the same doctor for the user
      const existingAppointment = await AppointmentModel.findOne({
        user_id: user_id,
        doctor_id: doctor_id,
        isPending: false,
      });
  
      if (existingAppointment) {
        return res.status(400).json({
          status: false,
          message: "You already have a pending appointment with this doctor. Please wait for approval.",
        });
      }
  
      // Create a new appointment
      const newAppointment = await new AppointmentModel({
        user_id: user_id,
        department_id: department_id,
        doctor_id: doctor_id,
        phone: phone,
        message: message,
      });
  
      const result = await newAppointment.save();
  
      return res.status(200).json({
        status: true,
        message: "Thank you for making an appointment. It will take some time to approve.",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Error in creating appointment.",
      });
    }
};
  
// Create Blog Comment and Like
exports.CreateBlogComment = async (req,res)=>{
    try {
        const {blog_Id,user_id,comment} = req.body

        const NewComment = await new BlogCommentModel({
            blog_Id,
            user_id,
            comment,
        })
        const result = await NewComment.save()
        res.status(200).json({
            status:200,
            message:"Blog Comment Successfully",
            data:result,
        })
    }
    catch (error) {
        res.status(400).json({
            status:400,
            message:"Error in blog comment",
        })
        console.log(error);
    }
}

// Get Blog Comment
exports.GetBlogComment = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await BlogCommentModel.find({blog_Id:id}).populate("user_id")

    const count = result.length

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Blog Comment not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Blog Comment Fetched",
      data: result,
      count
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in fetching blog comment",
      error: error.message,
    });
  }
};

// Contact Us
exports.CreateContact = async (req, res) => {
    try {
        const { name, email, topic, phone, msg } = req.body;

        const duplicateCount = await ContactModel.countDocuments({
            name: name,
            phone: phone,
            email: email
        });

        if (duplicateCount >= 2) {
            return res.status(400).json({
                status: 400,
                message: "You already sent a message to us!",
            });
        } else {

            const newContact = new ContactModel({
                name: name,
                email: email,
                topic: topic,
                phone: phone,
                msg: msg,
            });
    
            const result = await newContact.save();
            return res.status(200).json({
                status: true,
                message: "Message Sent Successfully",
                data: result,
            });
        }

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Error In Contact Us",
        });
    }
};

// Get Department id Wise All Doctors
exports.GetDepartmentWiseDoctors = async (req,res)=>{
    try {
        const id = req.params.id

        const result = await DoctorModel.find({department_id:id}).populate("department_id")

        return res.status(200).json({
            status:true,
            message:"Department Wise All Doctors Fetched",
            data:result,    
        })
    }
    catch (error) {
        res.status(400).json({
            status:false,
            message:"Error in Your Code"
        })
    }
}

// Get Featured Doctors
exports.GetFeaturedDoctors = async (req,res)=>{
    try {
        const result = await DoctorModel.aggregate([
            {
                $match:{
                    featured:true
                }
            },
            {    $lookup:{
                    from:"departments",
                    localField:"department_id",
                    foreignField:"_id",
                    as:"department_details",
                },
            }
        ])
        return res.status(200).json({
            status:true,
            message:"Featured Doctors Fetched",
            data:result,
        })
    }
    catch (error) {
        res.status(400).json({
            status:false,
            message:"Error"
        })
    }
}

// Get Single Doctor Details
exports.GetSingleDoctor = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await DoctorModel.findById(id).populate('department_id');
        // Assuming 'department_id' is the field you want to populate

        res.status(200).json({
            status: true,
            message: "Single Doctor Fetched",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Error in fetching Single Doctor",
            error: error.message,
        });
    }
};

// Get Personal Care Doctors
exports.GetPersonalCareDoctors = async (req,res)=>{
    try {

        const PcareFilter = await DepartmentModel.find({"departmentName":"Personal Care"}).populate("doctor_id")
          
          res.status(200).json({
            status: true,
            message: "Personal Care Doctors Fetched",
            data: PcareFilter,
          });
          
          
          
    }
    catch (error) {
        res.status(400).json({
            status:false,
            message:"Error in Personal Doctors",
        })
        console.log(error);
    }
}

// Get Child Care Doctors
exports.GetChildCareDoctors = async (req,res)=>{
    try {

        const CcareFilter = await DepartmentModel.find({"departmentName":"Child Care"}).populate("doctor_id")
          
          res.status(200).json({
            status: true,
            message: "Child Care Doctors Fetched",
            data: CcareFilter,
          });
          
          
          
    }
    catch (error) {
        res.status(400).json({
            status:false,
            message:"Error in Child Doctors",
        })
        console.log(error);
    }
}

// Get User Dashboard
// exports.GetUserDashBoard = async (req, res) => {
//     try {
//       const id = req.params.id;
  
//       console.log("User ID:", id); // Log user ID
  
//       const result = await AppointmentModel.aggregate([
//         {
//           $match: { user_id: id }
//         },
//         {
//           $lookup: {
//             from: "departments",
//             localField: "department_id",
//             foreignField: "_id",
//             as: "department_data"
//           }
//         },
//         {
//           $lookup: {
//             from: "doctors",
//             localField: "doctor_id",
//             foreignField: "_id",
//             as: "doctor_data"
//           }
//         }
//       ]);
  
//       console.log("Aggregation Result:", result); // Log aggregation result
  
//       res.status(200).json({
//         status: true,
//         message: "User Dashboard Fetched",
//         data: result,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({
//         status: false,
//         message: "Error in User Dashboard",
//       });
//     }
//   };
  
// Get User Dashboard
exports.GetUserDashBoard = async (req, res) => {
    try {
      const id = req.params.id;
  
      const result = await AppointmentModel.find({ user_id: id }).populate("department_id").populate("doctor_id")
        
  
      res.status(200).json({
        status: true,
        message: "User Dashboard Fetched",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error in User Dashboard",
      });
      console.error(error);
    }
};

// Get Recent Blogs
exports.GetRecentBlogs = async (req,res)=>{
    try {
        const result = await BlogModel.find().sort({createdAt : -1}).limit(5)

        res.status(200).json({
            status:true,
            message:"recent blog fetched",
            data:result,
        })
    }
    catch (error) {
        res.status(400).json({
            status:false,
            message:"Error in recent blogs",
        })
    }
}

// Search Blog
exports.SearchBlog = async (req,res)=>{
    try {

        const key = req.params.key

        const result = await BlogModel.find({
            $or: [
              { title: { $regex: key, $options: 'i' } },
            ]
          })

          const count = result.length

        res.status(200).json({
            status:true,
            message:"Blog Searched Successfully",
            data:result,
            count:count,
        })
    }
    catch (error) {
        res.satus(400).json({
            status:false,
            message:"Error in search",
        })
    }
}