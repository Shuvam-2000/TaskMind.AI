import express from 'express';
import { getPendingTaskFromAI } from '../controllers/ai.controller.js';
import { isUserAuthenticated } from '../middlewares/user.middleware.js';

const router = express.Router();

// route to fetch the pending task info
router.post('/taskpending', isUserAuthenticated, getPendingTaskFromAI);

export default router;