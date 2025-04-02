import Task from '../models/task.model.js';

// creating new task
export const createNewTask = async (req,res) => {
    try {
        const { title, description, status } = req.body
        if(!title) return res.status(400).json({
            message: "Please Provide Your Task Name",
            success: false
        })

        // Extract user ID from middlewares
        const userId = req.user?.id;

        if(!userId) return res.status(400).json({
            message: "UserId Not Found",
            success: false
        })

        // create new task
        const newTask = new Task ({
            title,
            description,
            status,
            user: userId
        })

        // save the new task job to the database
        await newTask.save()
        res.status(201).json({
            message: "Task Created Successfully",
            success: true,
            task: newTask
        })
    } catch (error) {
        res.status({
            message: "Internal Server Error",
            success: false
        })
    }
}

// Edit an existing task
export const editExistingTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title && !description) {
            return res.status(400).json({
                message: "Please provide title or description to update",
                success: false
            });
        }

        // Extract user ID from middleware
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found",
                success: false
            });
        }

        const taskId = req.params.id;

        if (!taskId) {
            return res.status(400).json({
                message: "Task ID not found",
                success: false
            });
        }

        // Check if the task exists and belongs to the user
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
                success: false
            });
        }

        // Updating only allowed fields
        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: updatedFields },
            { new: true }
        );

        res.status(200).json({
            message: "Task updated successfully",
            success: true,
            task: updatedTask
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate status
        if (!status) {
            return res.status(400).json({
                message: "Status Not Provided",
                success: false
            });
        }

        // Extract user ID from middleware
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({
                message: "User ID not found",
                success: false
            });
        }

        // Extract taskId from request parameters
        const taskId = req.params.id;
        if (!taskId) {
            return res.status(400).json({
                message: "Task ID not found",
                success: false
            });
        }

        // Find task and ensure user is the owner
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task Not Found",
                success: false
            });
        }

        // Update task status
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: { status } },
            { new: true }
        );

        res.status(200).json({
            message: "Status Updated Successfully",
            success: true,
            status: updatedTask
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Get all tasks for the logged-in user
export const getAllTasks = async (req, res) => {
    try {
        const userId = req.user?.id;

        // Validate user ID
        if (!userId) {
            return res.status(400).json({
                message: "User ID Not Found",
                success: false
            });
        }

        // Fetch all tasks of the user
        const allTasks = await Task.find({ user: userId });

        // Check if user has no tasks
        if (allTasks.length === 0) {
            return res.status(404).json({
                message: "No Tasks Found for this User",
                success: false
            });
        }

        res.status(200).json({
            message: "Tasks Retrieved Successfully",
            success: true,
            tasks: allTasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const userId = req.user?.id;

        // Validate user ID
        if (!userId) {
            return res.status(400).json({
                message: "User ID Not Found",
                success: false
            });
        }

        // Extract taskId from request parameters
        const taskId = req.params.id;
        if (!taskId) {
            return res.status(400).json({
                message: "Task ID Not Found",
                success: false
            });
        }

        // Find the task and check if it belongs to the logged-in user
        const task = await Task.findOne({ _id: taskId, user: userId });
        if (!task) {
            return res.status(404).json({
                message: "Task Not Found or Unauthorized",
                success: false
            });
        }

        // Delete the task
        await Task.findByIdAndDelete(taskId);

        res.status(200).json({
            message: "Task Deleted Successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
