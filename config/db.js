const mongoose = require("mongoose")

// Mongodb Connection
const MongoDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.DB_CONNECT)
        console.log(`MongoDB Connection Successfully ${conn.connection.host}`);
    }
    catch (error) {
        console.log(`Error in MongoDB ${error}`);
    }
}

module.exports=MongoDB