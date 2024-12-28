
import express from 'express';
import { getCourse, listCourses } from '../controllers/courseControllers';
const router = express.Router();

// these serve as routes for course controller, like an intermediary
router.get("/", listCourses);
router.get("/:courseId", getCourse);

export default router;