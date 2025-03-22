import User from '../models/user.models.js';
import { configDotenv } from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Load Environment Variables
configDotenv();

// new user registration
export const newUserRegistration = async (req,res) => {
    try {
        const { fullname, email, phoneNumber, password } = req.body;
        if(!fullname || !email || !phoneNumber || !password) return res.status(400).json({
            message: "All Fields Required",
            success: false
        });

        // check if user already exists
        const user = await User.findOne({ email });
        if(user) return res.status({
            message: "User Already Exists",
            success: false
        });

        // register new user with required fields & securely hash the password
        const newUser = new User({
            fullname,
            email,
            phoneNumber,
            password
        });

        // hash the password with bcyrpt
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();
        res.status(200).json({
            message: "Signed Up SuccessFully",
            sucess: true
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Intenral Server Error",
            success: false
        })
    }
}

export const existingUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All Fields Required",
                success: false
            });
        }

        // Validating if the email exists in the database
        const userLogin = await User.findOne({ email });
        const errorMessage = 'Incorrect Email or Password';

        if (!userLogin) {
            return res.status(400).json({
                message: errorMessage,
                success: false
            });
        }

        // Validating password
        const isPasswordMatched = await bcrypt.compare(password, userLogin.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: errorMessage,
                success: false
            });
        }

        // Initializing the JWT token for the user
        const token = jwt.sign(
            {
                email: userLogin.email,
                id: userLogin._id
            }, 
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set the token to the HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: `Welcome ${userLogin.fullname}`,
            user: userLogin,
            success: true
        });

    } catch (error) {
        console.error("Login Error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// user logout
export const userLogout = async (req,res) => {
    try {
        // clear cookie when user has logs out
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false, 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 0
        })

        res.status(200).json({
            message: "Logged Out SucceFully",
            success: true
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const userProfileUpdate = async (req, res) => {
    try {
        // Fields to be updated
        const { updates } = req.body;

        // Extract user ID from request parameters
        const userid = req.params.userid; 

        if (!userid) {
            return res.status(400).json({
                message: "User ID is required",
                success: false
            });
        }

        if (!updates) {
            return res.status(400).json({
                message: "No update fields provided",
                success: false
            });
        }

        // Update the user profile info for given fields
        const user = await User.findByIdAndUpdate(userid, { $set: updates }, { new: true });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
                success: false
            });
        }

        res.status(200).json({
            message: "Profile Updated Successfully",
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};
