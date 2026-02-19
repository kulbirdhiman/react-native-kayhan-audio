// checkoutApi.ts (or wherever you have checkoutApi)

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

    // ✅ NEW: Apply Coupon
    applyCoupon: builder.mutation({
      query: (body) => ({
        url: "/v1/checkout/add_coupon",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetShippingPriceMutation, useApplyCouponMutation } = checkoutApi;
