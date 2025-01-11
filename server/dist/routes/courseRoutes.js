"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseControllers_1 = require("../controllers/courseControllers");
const multer_1 = __importDefault(require("multer"));
/**
 * this multer is for temporary client storage for files and images before updating them to aws
 */
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// these serve as routes for course controller, like an intermediary
router.get("/", courseControllers_1.listCourses);
router.get("/:courseId", courseControllers_1.getCourse);
router.post("/", courseControllers_1.createCourse);
router.put("/:courseId", upload.single("image"), courseControllers_1.updateCourse);
router.delete("/:courseId", courseControllers_1.deleteCourse);
router.post("/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url", courseControllers_1.getUploadVideoUrl);
exports.default = router;
