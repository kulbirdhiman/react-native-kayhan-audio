import { apiSlice } from "../apiSlice";

export const homeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    newgetRecommendedProducts: builder.query({
      query: (params) => ({
        url: `/api/home/recomened_product`,
        params,
      }),
      keepUnusedDataFor: 5,
    //   providesTags: ["Home"],
    }),

    newgetAccessoriesProducts: builder.query({
      query: (params) => ({
        url: `/api/home/acessory_product`,
        params,
      }),
      keepUnusedDataFor: 5,
    //   providesTags: ["Home"],
    }),

    newgetAudioProducts: builder.query({
      query: (params) => ({
        url: `/api/home/audio_product`,
        params,
      }),
      keepUnusedDataFor: 5,
    //   providesTags: ["Home"],
    }),

    newgetWeeklyHighlights: builder.query({
      query: (params) => ({
        url: `/api/home/weekly_highlights`,
        params,
      }),
      keepUnusedDataFor: 5,
    //   providesTags: ["Home"],
    }),

    newgetHotDeals: builder.query({
      query: (params) => ({
        url: `/api/home/hot_deals`,
        params,
      }),
      keepUnusedDataFor: 5,
    //   providesTags: ["Home"],
    }),

    newcontactSupport: builder.mutation({
      query: (body) => ({
        url: `/v1/can_not_find/add`,
        method: "POST",
        body,
      }),
    //   invalidatesTags: ["Home"], // Invalidate to optionally refresh home queries
    }),
  }),
  overrideExisting: false,
});

export const {
  useNewgetHotDealsQuery,
  useNewgetAccessoriesProductsQuery,
  useNewgetWeeklyHighlightsQuery,
  useNewgetRecommendedProductsQuery,
  useNewcontactSupportMutation,
  useNewgetAudioProductsQuery,
} = homeApiSlice;
