import mongoose from "mongoose"; 

const TaskSchema = new mongoose.Schema({  
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["todo", "in progress", "completed"],
        default: "todo"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);
export default Task;
