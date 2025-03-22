import express from "express";
import {
  newUserRegistration,
  existingUserLogin,
  userLogout,
  userProfileUpdate,
} from "../controllers/user.controller.js";
import { isUserAuthenticated } from "../middlewares/user.middleware.js";

const router = express.Router();

// new user signup
router.post("/signup", newUserRegistration);

// user login route
router.post("/login", existingUserLogin);

// user proifle update route
router.put("/proifleupdate/:userid", isUserAuthenticated, userProfileUpdate);

// user logout
router.get("/logout", userLogout);

export default router;