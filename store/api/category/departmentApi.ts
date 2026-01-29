// services/departmentApi.ts
import { apiSlice } from "../apiSlice";

export const departmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<any, void>({
      query: () => ({
        url: "/v1/department/list",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const { useGetDepartmentsQuery } = departmentApi;
