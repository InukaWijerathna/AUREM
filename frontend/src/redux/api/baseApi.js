import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearCredentials } from '../authSlice';
import { clearCartState } from '../cartSlice';

// In dev: VITE_API_URL is unset → '/api' is caught by the Vite proxy → localhost:5000
// In prod: VITE_API_URL = 'https://your-backend.vercel.app' → full cross-origin URL
const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL ?? ''}/api`,
  credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try refresh
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
      api.dispatch(clearCartState());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Product', 'Category', 'Order', 'Cart', 'Wishlist', 'Coupon'],
  endpoints: () => ({}),
});
