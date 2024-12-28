import { Request, Response } from "express";
import Course from "../models/courseModel";

export const listCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.query;
  try {
    // looks for all courses if no category is provided
    const courses =
      category && category !== "all"
        ? await Course.scan("category").eq(category).exec()
        : await Course.scan().exec();
    res.json({ message: "Courses fetched successfully", data: courses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

export const getCourse = async (
  req: Request,
  res: Response
): Promise<void> => {

    // request params comes from the url params
  const { courseId } = req.params;
  try {
    const course = await Course.get(courseId);
    if(!course) {
        res.status(404).json({message: "Course not found"})
        return;
        }
    // looks for all courses if no category is provided
    res.json({ message: "Courses fetched successfully", data: course });
    // res.json({ message: "Courses fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
};


