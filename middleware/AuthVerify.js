const JWT = require("jsonwebtoken")



// Admin Token Verify
const AdminVerifyToken = async (req, res, next) => {
    
    const adminToken = req.body.adminToken || req.query.adminToken || req.cookies.adminToken;

    if (!adminToken) {
        console.log("A Token is Required");
        return res.redirect("/admin/");
    }

    try {
        const decode = await JWT.verify(adminToken, process.env.JWT_SECRET_KEY);
        req.admin = decode;

        return next();

    } catch (error) {
        console.log(`Invalid Token Access ${error}`);
        return res.redirect("/admin/");
    }

};




// User Token Verify
const UserVerifyToken = async (req, res, next) => {
    const userToken = req.body.userToken || req.query.userToken || req.headers["x-access-token"];

    if (!userToken) {
        return res.status(400).json({
            status: false,
            message: "A Token is Required",
        });
    }

    try {
        const decode = await JWT.verify(userToken, process.env.JWT_SECRET_KEY);
        req.user = decode;

        return next();
    } catch (error) {
        // Use next(error) to pass the error to the error-handling middleware
        return next(error);
    }
};

module.exports = UserVerifyToken;


module.exports={AdminVerifyToken,UserVerifyToken}