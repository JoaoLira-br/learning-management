import { Request, Response } from "express";
import Course from "../models/courseModel";
/*
* UUIDv4 stands for universally unique identifier,
 it ensures that each course and section has a unique ID,
  which is important for distinguishing between different entities in your application.
*/
import { v4 as uuidv4 } from "uuid";
import AWS from 'aws-sdk';
import { getAuth } from "@clerk/express";

// distribute video files to aws s3 bucket in a fast performant manner
const s3 = new AWS.S3();

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

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  // request params comes from the url params
  const { courseId } = req.params;
  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    // looks for all courses if no category is provided
    res.json({ message: "Courses fetched successfully", data: course });
    // res.json({ message: "Courses fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
};


export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teacherId, teacherName } = req.body;

    if (!teacherId || !teacherName) {
      res.status(400).json({ message: "Teacher Id and name are required" });
      return;
    }

    const newCourse = new Course({
      courseId: uuidv4(),
      teacherId,
      teacherName,
      title: "Untitled Course",
      description: "",
      category: "Uncategorized",
      image: "",
      price: 0,
      level: "Beginner",
      status: "Draft",
      sections: [],
      enrollments: [],
    });
    await newCourse.save();

    res.json({ message: "Course created successfully", data: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error });
  }
};
export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);
  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    // if (course.teacherId !== userId) {
    //   res
    //     .status(403)
    //     .json({ message: "You are not allowed to update this course" });
    //   return;
    // }

    if (updateData.price) {
      const price = parseInt(updateData.price);
      if (isNaN(price)) {
        res
          .status(400)
          .json({
            message: "invalid price format",
            error: "Price must be a valid number",
          });
        return;
      }
      updateData.price = price * 100
    }
    if(updateData.sections){
      const sectionsData = typeof updateData.sections === "string"
      ? JSON.parse(updateData.sections) : updateData.sections;

      updateData.sections = sectionsData.map((section: any) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),
        chapters: section.chapters.map((chapter: any) => ({
          ...chapter,
          chapterId: chapter.chapterId || uuidv4(),
        }))
      }))
    }

    Object.assign(course, updateData);
    await course.save();
    res.json({ message: "Course updated successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });

  }
};
export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const { userId } = getAuth(req);
  try {
    const course = await Course.get(courseId);


    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    // if (course.teacherId !== userId) {
    //   res
    //     .status(403)
    //     .json({ message: "You are not allowed to delete this course" });
    //   return;
    // }

    await Course.delete(courseId);
    res.json({ message: "Course deleted successfully"});
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};
export const getUploadVideoUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  // this is the file name and type that will be uploaded
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    res.status(400).json({ message: "File name and type are required" });
    return;
  }

  try {
    const uniqueId = uuidv4();
    // this will be like a directory inside the bucket
    const s3Key = `videos/${uniqueId}/${fileName}`;

    const s3Params = {
      // this is the bucket name
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 60,
      ContentType: fileType,
    };

    // this generates a signed url that can be used to upload the video file in the frontend
    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    // this is the url that will be used to access the video file after it has been uploaded
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${fileName}`;

    res.json({
      message: "Upload URL generated successfully",
      data: { uploadUrl, videoUrl },
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};

