// services/categoryApi.ts
import { apiSlice } from "../apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all categories
    getCategories: builder.query<any, { type?: string; department_id?: string; search?: string; category_ids?: number[] }>({
      query: (params) => ({
        url: "/v1/category/list",
        method: "GET",
        params, // RTK Query automatically serializes query params
      }),
      keepUnusedDataFor: 60, // Optional: cache for 60 seconds
    }),

    // Fetch category detail by slug
    getCategoryDetail: builder.query<any, { slug: string; model_id?: string; is_all?: string; search?: string; department_id?: string }>({
      query: ({ slug, ...params }) => ({
        url: `/v1/category/detail/${slug}`,
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 60,
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const { useGetCategoriesQuery, useGetCategoryDetailQuery } = categoryApi;
