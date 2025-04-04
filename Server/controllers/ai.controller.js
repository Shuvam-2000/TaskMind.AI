import Task from "../models/task.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

// Load Environment Variables
configDotenv();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// pending task info fetching thorugh AI
export const getPendingTaskFromAI = async (req, res) => {
    try {
        const userid = req.user?.id;

        if (!userid) {
            return res.status(400).json({
                message: "UserId Not Found",
                success: false
            });
        }

        // convert userid to ObjectId
        const userIdObject = new mongoose.Types.ObjectId(userid);

        // fetch pending taks from the database
        const pendingTasks = await Task.find({ user: userIdObject, status: "todo" });

        // response to the user of the pending task
        const taskListText = pendingTasks.length === 0
            ? "You have no pending tasks."
            : pendingTasks.map((task, index) => `${index + 1}. ${task.title}`).join("\n");

        const geminiPrompt = `You are an AI task assistant. Based on the following list of pending tasks for a user, generate a helpful and motivating summary. If there are no tasks, let the user know politely.\n\nPending Tasks:\n${taskListText}`;

        // Use Gemini AI Model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(geminiPrompt);
        const response = result.response.text();

        res.status(200).json({ response });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
