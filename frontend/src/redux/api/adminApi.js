import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard',
    }),
  }),
});

export const { useGetDashboardStatsQuery } = adminApi;
