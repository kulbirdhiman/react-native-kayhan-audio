// store/api/admin/carModelApi.ts
import { apiSlice } from "../apiSlice";

export const carModelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get car models with no parent (roots)
  getRootCarModelsByCategory: builder.query({
    query : (id)=>({
      url : `/v1/car-model/roots/${id}`,
      method : "GET"
    })
  }),

    getChildrenByParentId: builder.query<any[], number | string>({
      query: (parentId) => `/v1/car-model/children/${parentId}`,
    }),
  }),
});

export const {
  useGetRootCarModelsByCategoryQuery,
  useGetChildrenByParentIdQuery,
} = carModelApi;
