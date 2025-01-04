import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";

import { User } from "@clerk/nextjs/server";

import { toast } from "sonner";


const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    // this function will be called before the request is sent to the server, it will request the token from Clerk, thus authenticating every request
    // prepareHeaders: async (headers) => {
    //   const token = await window.Clerk?.session?.getToken();
    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  });
  try {
    const result: any = await baseQuery(args, api, extraOptions);
    console.log(`result:`, {result});
    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "an error occurred";

      toast.error(`Error: ${errorMessage}`);
    }
    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";
    if (isMutationRequest && result.data) {
      const successMessage = result.data?.message || "Success";
      if (successMessage) {
        toast.success(successMessage);
      }
    }
    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null };
    }
    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};
export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  // tagTypes; represent the data we receive from backend: important for validation
  tagTypes: ["Courses"],
  endpoints: (build) => ({
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updateUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updateUser,
      }),
      invalidatesTags: ["Users"],
    }),
    // this is a function from RTK library from Redux Toolkit
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { category },
      }),
      // this tags the result for cache management purposes
      providesTags: ["Courses"],
    }),
    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
    getTransactions: build.query<Transaction[], string>({
      query: (userId) => `transactions?userId=${userId}`,
    })
    ,
    createStripePaymentIntent: build.mutation<
      { clientSecret: string },
      { amount: number }
    >({
      query: ({ amount }) => ({
        url: `/transactions/stripe/payment-intent`,
        method: "POST",
        body: { amount },
      }),
    }),
    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
    }),

    // createTransaction: build.mutation<Transaction, Partial<Transaction>>({
    //   query: (transaction) => ({
    //     url: "transactions",
    //     method: "POST",
    //     body: transaction,
    //   }),
    // }),
  }),
});

/* 
    ===============
    USER CLERK
    =============== 
    */

export const {
  // export getCourses() format
  useGetCoursesQuery,
  useGetCourseQuery,
  useUpdateUserMutation,
  useCreateStripePaymentIntentMutation,
  useCreateTransactionMutation,
  useGetTransactionsQuery
} = api;
