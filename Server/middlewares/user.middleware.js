import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

// Load Environment variables
configDotenv();

// verify the user is authenticated
export const isUserAuthenticated = async (req,res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({
            message: "Access Denied, User Not Authenticated",
            success: false
        })

        // verify the token from the cookies
        const tokenIsVerified = jwt.verify(token, process.env.JWT_SECRET);

        // attach th user information to the request object
        req.user = tokenIsVerified;
        next(); // Move to the next middlware or function
        
    } catch (error) {
        res.status(500).json({
            message: "Intenral Server Error",
            success: false
        })
    }
}