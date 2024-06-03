import { configureStore } from '@reduxjs/toolkit'
import  userReducer from './student/studentSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})