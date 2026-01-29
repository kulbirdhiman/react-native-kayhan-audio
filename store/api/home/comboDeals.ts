// store/api/comboDeals.ts
import { apiSlice } from "../apiSlice";

export const comboDealsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createComboDeal: builder.mutation({
      query: (payload) => ({
        url: "/v1/combodeals",
        method: "POST",
        body: payload,
      }),
    }),

    getAllComboDeals: builder.query({
      query: () => "/v1/combodeals",
    }),

    deleteComboDeal: builder.mutation({
      query: (id) => ({
        url: `/v1/combodeals/${id}`,
        method: "DELETE",
      }),
    }),

    updateComboDeal: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/v1/combodeals/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    getCombodealByID: builder.query({
      query: (id) => ({
        url: `/v1/combodeals/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateComboDealMutation,
  useGetAllComboDealsQuery,
  useDeleteComboDealMutation,
  useUpdateComboDealMutation,
  useGetCombodealByIDQuery
} = comboDealsApi;
