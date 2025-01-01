import { Request, Response } from "express";
import Course from "../models/courseModel";
import { clerkClient } from '../index';

export const updateUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { userId } = req.params;
    const userData = req.body;
      // request params comes from the url params

    try {
    await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
            userType: userData.publicMetadata.userType,
            settings: userData.publicMetadata.settings
        }
    })
      // looks for all courses if no category is provided

      // res.json({ message: "Courses fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  };