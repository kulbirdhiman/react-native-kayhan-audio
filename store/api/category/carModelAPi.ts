// services/carModelApi.ts
import { apiSlice } from "../apiSlice";

export const carModelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch car model detail (years)
    getCarModelDetail: builder.query<
      { id: number; slug: string; name: string }[], // Result type: array of years
      { model_id: string } // Parameter: model_id
    >({
      query: ({ model_id }) => ({
        url: `/v1/car_model/${model_id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60, // Cache for 60 seconds
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const { useGetCarModelDetailQuery } = carModelApi;
