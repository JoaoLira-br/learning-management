
import express from 'express';

import { createStripePaymentIntent, createTransaction, listTransactions } from '../controllers/transactionController';
import { getUserCourseProgress, getUserEnrolledCourses, updateUserCourseProgress } from '../controllers/userCourseProgressController';
const router = express.Router();

// these serve as routes for course controller, like an intermediary

router.get("/:userId/enrolled-courses", getUserEnrolledCourses)
router.get("/:userId/courses/:courseId", getUserCourseProgress);
router.put("/:userId/courses/:courseId", updateUserCourseProgress);

export default router;