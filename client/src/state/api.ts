import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {BaseQueryApi, FetchArgs} from '@reduxjs/toolkit/query';
import { useUpdateCourseMutation } from "../../../asset-download/client/state/api";
import { User } from '@clerk/nextjs/server';


const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL});
  try{
    const result: any = await baseQuery( args, api, extraOptions)
    if(result.data){
      result.data = result.data.data;
    }
    return result;
  } catch(error: unknown){
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return {error: {status: "FETCH_ERROR", error: errorMessage}}
  }
}
export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  // tagTypes; represent the data we receive from backend: important for validation
  tagTypes: ["Courses"],
  endpoints: (build) => ({
    updateUser: build.mutation<User, Partial<User> & {userId: string}>({
      query: ({userId, ...updateUser }) => ({

        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updateUser
      }),
      invalidatesTags: ["Users"]
    }),
    // this is a function from RTK library from Redux Toolkit
    getCourses: build.query<Course[], {category?: string}>({
      query: ({ category }) => ({
        url: "courses",
        params: {category}
      }),
      // this tags the result for cache management purposes
      providesTags: ["Courses"]
    }),
    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{type: "Courses", id}]
    })
  
  })
})

    /* 
    ===============
    USER CLERK
    =============== 
    */
    
export const {
  // export getCourses() format
  useGetCoursesQuery,
  useGetCourseQuery,
  useUpdateUserMutation
} = api;