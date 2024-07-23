import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

const initialState = {
  subjects: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all subjects
export const fetchSubjects = createAsyncThunk('subjects/fetchSubjects', async () => {
  const response = await apiCall('get', endpoints.FETCH_SUBJECTS);
  return response.data;
});

// Async thunk to add a new subject
export const addSubject = createAsyncThunk('subjects/addSubject', async (subject) => {
  const response = await apiCall('post', endpoints.ADD_SUBJECT, subject);
  return response.data;
});

// Async thunk to update a subject
export const updateSubject = createAsyncThunk('subjects/updateSubject', async ({ id, name }) => {
 
  const response = await apiCall('put', `${endpoints.UPDATE_SUBJECT}/${id}`, { name });
  return response.data;
});



const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjects = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add subject
      .addCase(addSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload);
        state.loading = false;
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update subject
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex((subject) => subject._id === action.payload._id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      
  },
});

export default subjectSlice.reducer;
