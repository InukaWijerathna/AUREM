import { baseApi } from './baseApi';
import { setCart } from '../cartSlice';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCart(data.cart));
        } catch {}
      },
    }),
    addToCart: builder.mutation({
      query: (data) => ({ url: '/cart/add', method: 'POST', body: data }),
      invalidatesTags: ['Cart'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCart(data.cart));
        } catch {}
      },
    }),
    updateCartItem: builder.mutation({
      query: (data) => ({ url: '/cart/update', method: 'PUT', body: data }),
      invalidatesTags: ['Cart'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCart(data.cart));
        } catch {}
      },
    }),
    removeCartItem: builder.mutation({
      query: (productId) => ({ url: `/cart/remove/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCart(data.cart));
        } catch {}
      },
    }),
    clearCart: builder.mutation({
      query: () => ({ url: '/cart/clear', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    applyCoupon: builder.mutation({
      query: (data) => ({ url: '/cart/coupon', method: 'POST', body: data }),
      invalidatesTags: ['Cart'],
    }),
    removeCoupon: builder.mutation({
      query: () => ({ url: '/cart/coupon', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = cartApi;
