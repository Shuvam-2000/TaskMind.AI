import express from "express";
import {
  createNewTask,
  editExistingTask,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";
import { isUserAuthenticated } from "../middlewares/user.middleware.js";

const router = express.Router();

// route for creating new task
router.post("/newtask", isUserAuthenticated, createNewTask);

// route for editing a exisitng task
router.put("/edittask/:id", isUserAuthenticated, editExistingTask);

// update the task status
router.patch("/updatestatus/:id", isUserAuthenticated, updateTaskStatus);

// get all the tasks
router.get("/alltasks", isUserAuthenticated, getAllTasks);

// delete the task
router.delete("/deleteTask/:id", isUserAuthenticated, deleteTask);

export default router;
