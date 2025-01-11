
import express from 'express';
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse, getUploadVideoUrl } from '../controllers/courseControllers';
import { requireAuth } from '@clerk/express';
import multer from "multer"
/**
 * this multer is for temporary client storage for files and images before updating them to aws
 */

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

// these serve as routes for course controller, like an intermediary
router.get("/", listCourses);
router.get("/:courseId", getCourse);
router.post("/", createCourse)
router.put("/:courseId", upload.single("image"), updateCourse)
router.delete("/:courseId", deleteCourse)
router.post(
    "/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url",
    getUploadVideoUrl
  );
  


export default router;