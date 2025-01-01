
import express from 'express';
import { updateUser } from '../controllers/userClerkController';
const router = express.Router();

// these serve as routes for course controller, like an intermediary
router.put("/:userId", updateUser)

export default router;