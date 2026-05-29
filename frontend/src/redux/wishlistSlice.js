import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    ids: [],
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
      state.ids = action.payload.map((p) => (typeof p === 'string' ? p : p._id));
    },
    toggleWishlistItem: (state, action) => {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((i) => i !== id);
        state.items = state.items.filter((i) => (typeof i === 'string' ? i !== id : i._id !== id));
      } else {
        state.ids.push(id);
      }
    },
  },
});

export const { setWishlist, toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectWishlistIds = (state) => state.wishlist.ids;
export const selectWishlistItems = (state) => state.wishlist.items;
