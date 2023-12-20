const regcreate=async(req,res)=>{
    try{
       const User=new userModel({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.path,
        password:bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(12)),
        answer:req.body.answer
       })
       const data=await userModel.findOne({email:req.body.email});
       if(!req.body.name||!req.body.email||!req.body.phone||!req.body.password||!req.body.answer){
        return res.status(400).json({
            success:false,
            message:"all fields are required!",
           
        })
       }else{
          if(data){
            return res.status(400).json({
                success:false,
                message:"user already exists!"
               
            })
          }else{
            User.save()
            .then((user)=>{
                console.log(user._id);
               const Token=new tokenModel({
                _userId:user._id,
                token:crypto.randomBytes(16).toString('hex')
               })
               Token.save()
               .then((token)=>{
                const transPorter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: "sttksarkar5261@gmail.com",
                        pass: "pgfhifvnazrlkbiq",
                    }
                });
                
                const mailOptions={
                    from: 'mailto:no-reply@sattik.com',
                    to: user.email,
                    subject: 'Account Verification',
                    text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link:'+`http://localhost:${process.env.PORT}/api/confirmation/${user.email}/${token.token}` 
                }
                transPorter.sendMail(mailOptions);
                return res.status(200).json({
                    success:true,
                    message:"verification link sent!",
                    user
                })
               })
               .catch((error)=>{
                return res.status(400).json({
                    success:false,
                    message:"token save error!"
                })
               })
            })
            .catch((error)=>{
                return res.status(400).json({
                    success:false,
                    message:error
                })
            })
          }
       }
    }
    catch(error){
        console.log(error);
         return res.status(400).json({
            success:false,
            message:"error"
         })
    }
  }
  


  
  const confirmation=async(req,res)=>{
    try{
      const token=await tokenModel.findOne({token:req.params.token});
      if(token){
         userModel.findOne({_id:token._userId,email:req.params.email})
         .then((user)=>{
            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"user doesnt exist!"
                })
            }else{
                if(user.isVerified==true){
                    return res.status(400).json({
                        success:false,
                        message:"user is already verified!"
                    })
                }else{
                    user.isVerified=true;
                    user.save();
                    return res.status(200).json({
                        success:true,
                        message:"user is verified!"
                    })
                }
            }
         })
      }else{
        return res.status(400).json({
            success:false,
            message:"token is not found!"
        })
      }
      
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"error!"
        })
    }
  }









  // model 

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    memberId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'member',
    },
    token:{
        type:String,
        required:true
    },
    expiredAt:{
        type:Date,
        default:Date.now,
        index:{
            expires:86400000
        }
    }
})

const tokenModel = new mongoose.model("token",tokenSchema);
module.exports =tokenModel;

  