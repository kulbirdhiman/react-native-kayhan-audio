import Constants from "expo-constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = Constants.expoConfig?.extra?.API_URL;

console.log("API_URL =>", API_URL); // debug once

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});

export default apiSlice;
