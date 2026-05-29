import { baseApi } from './baseApi';
import { setWishlist, toggleWishlistItem } from '../wishlistSlice';

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setWishlist(data.wishlist));
        } catch {}
      },
    }),
    toggleWishlist: builder.mutation({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: 'POST' }),
      invalidatesTags: ['Wishlist'],
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        dispatch(toggleWishlistItem(productId));
        try {
          await queryFulfilled;
        } catch {
          dispatch(toggleWishlistItem(productId)); // revert on error
        }
      },
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
