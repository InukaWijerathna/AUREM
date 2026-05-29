import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    couponCode: '',
    isOpen: false,
  },
  reducers: {
    setCart: (state, action) => {
      const cart = action.payload;
      state.items = cart.items || [];
      state.itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
      state.subtotal = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;
      state.discount = cart.discount || 0;
      state.couponCode = cart.couponCode || '';
    },
    clearCartState: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.couponCode = '';
    },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
  },
});

export const { setCart, clearCartState, openCart, closeCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartDiscount = (state) => state.cart.discount;
export const selectCartIsOpen = (state) => state.cart.isOpen;
