import apiSlice from "../apiSlice";

export const AuthApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<
      any,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/v1/auth/sign_in",
        method: "POST",
        body,
      }),
    }),

    signUp: builder.mutation<
      any,
      {
        email: string;
        password: string;
        confirmPassword: string;
        name: string;
        last_name: string;
        country: object;
        phone: string | number;
      }
    >({
      query: (body) => ({
        url: "/v1/auth/sign_up",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignInMutation,
  useSignUpMutation,
} = AuthApiSlice;
