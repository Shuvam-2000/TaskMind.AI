import Task from "../models/task.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";

// Load Environment Variables
configDotenv();

// Initalize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI task Handler
export const aiTaskHandler = async (req,res) => {
    try {

        // extracting the userid from the middleware
        const userid = req.user?.id
        if(!userid) return res.status(400).json({
            message: "UserId Not Found",
            success: false
        })
        const { prompt } = req.body.prompt?.trim().toLowerCase()
        let responseMesage = ""

        if(prompt.includes("pending tasks") || prompt.includes("how many task created")){
            const taskPending = await Task.find({ userid, status: "todo" });
            if(taskPending.length === 0) {
                responseMesage = "You Have Not Created Any Task"
            }else{
                responseMesage = `You have ${taskPending.length} no of task pending. They are`
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}