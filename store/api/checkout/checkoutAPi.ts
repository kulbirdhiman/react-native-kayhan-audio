// apiSlice.ts

import apiSlice from "../apiSlice";

export const checkoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShippingPrice: builder.mutation<
      any,
      { products: any[]; shipping_address: any }
    >({
      query: (body) => ({
        url: "/v1/checkout/shipping_price",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetShippingPriceMutation } = checkoutApi;
