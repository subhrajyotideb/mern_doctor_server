const JWT = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


// Hash Forget
const SecureForget = async (forget)=>{
    try {
        const HashForget = await bcrypt.hash(forget, 10)
        return HashForget
    }
    catch (error) {
        console.log(`error in Forget Hashing ${error}`);
    }
}

// Hash Password
const SecurePassword = async (password)=>{
    try {
        const HashPassword = await bcrypt.hash(password, 10)
        return HashPassword
    }
    catch (error) {
        console.log(`error in Password Hashing ${error}`);
    }
}

// Create Admin Token
const CreateAdminToken = async (id)=>{
    try {
        const AdminToken = await JWT.sign({_id:id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
        return AdminToken
    }
    catch (error) {
        console.log(`error in Admin Create Token ${error}`);
    }
}

// Create User Token
const CreateUserToken = async (id)=>{
    try {
        const UserToken = await JWT.sign({_id:id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
        return UserToken
    }
    catch (error) {
        console.log(`error in User Create Token ${error}`);
    }
}


module.exports={SecurePassword,CreateAdminToken,CreateUserToken,SecureForget}