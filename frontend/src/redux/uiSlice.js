import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    confirmDialog: { isOpen: false, title: '', message: '', onConfirm: null },
  },
  reducers: {
    openConfirmDialog: (state, action) => {
      state.confirmDialog = { isOpen: true, ...action.payload };
    },
    closeConfirmDialog: (state) => {
      state.confirmDialog = { isOpen: false, title: '', message: '', onConfirm: null };
    },
  },
});

export const { openConfirmDialog, closeConfirmDialog } = uiSlice.actions;
export default uiSlice.reducer;
