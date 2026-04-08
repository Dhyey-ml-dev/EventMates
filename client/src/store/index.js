import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import eventReducer from './eventSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
  },
});

export default store;
