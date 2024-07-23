import { configureStore, combineReducers } from '@reduxjs/toolkit';
import studentReducer from './student/studentSlice';
import tutorReducer from './tutor/tutorSlice';
import adminReducer from './admin/adminSlice';
import themeReducer from './theme/themeSlice';
import subjectReducer from './subjects/subjectsSlice';


// Combine reducers without persistence
const rootReducer = combineReducers({
  student: studentReducer,
  tutor: tutorReducer,
  admin: adminReducer,
  theme: themeReducer,
  subjects: subjectReducer,
 
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
