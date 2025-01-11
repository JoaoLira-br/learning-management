import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetCourseQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";

// this hook is used to get the course progress data for the current user, providing separation of concerns between the UI and the data fetching logic
export const useCourseProgressData = () => {
  const { courseId, chapterId } = useParams();
  const { user, isLoaded } = useUser();
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  const [updateProgress] = useUpdateUserCourseProgressMutation();

  const { data: course, isLoading: courseLoading } = useGetCourseQuery(
    (courseId as string) ?? "",
    {
      skip: !courseId,
    }
  );

  // this query fetches the user's progress for the course
  const { data: userProgress, isLoading: progressLoading } =
    useGetUserCourseProgressQuery(
      {
        userId: user?.id ?? "",
        courseId: (courseId as string) ?? "",
      },
      {
        skip: !isLoaded || !user || !courseId,
      }
    );

  const isLoading = !isLoaded || courseLoading || progressLoading;

  const currentSection = course?.sections.find((s) =>
    s.chapters.some((c) => c.chapterId === chapterId)
  );

  const currentChapter = currentSection?.chapters.find(
    (c) => c.chapterId === chapterId
  );
  
  // this function checks if the current chapter is completed
  const isChapterCompleted = () => {
    if (!currentSection || !currentChapter || !userProgress?.sections)
      return false;

    const section = userProgress.sections.find(
      (s) => s.sectionId === currentSection.sectionId
    );
    return (
      section?.chapters.some(
        (c) => c.chapterId === currentChapter.chapterId && c.completed
      ) ?? false
    );
  };

  // this function updates the user's progress for the current chapter
  const updateChapterProgress = (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => {
    if (!user) return;

    const updatedSections = [
      {
        sectionId,
        chapters: [
          {
            chapterId,
            completed,
          },
        ],
      },
    ];

    updateProgress({
      userId: user.id,
      courseId: (courseId as string) ?? "",
      progressData: {
        sections: updatedSections,
      },
    });
  };

  return {
    user,
    courseId,
    chapterId,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  };
};