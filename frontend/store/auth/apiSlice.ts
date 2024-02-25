import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const refreshApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    refreshAuthorization: builder.query({
      query: () => "/api/auth/refresh",
    }),
  }),
});

export const { useRefreshAuthorizationQuery } = refreshApi;
