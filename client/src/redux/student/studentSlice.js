import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

export const fetchStudentData = createAsyncThunk('auth/fetchStudentData', async (token) => {
  const response = await apiCall('get', endpoints.FETCH_STUDENTS_DATA, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const fetchStudentBookedSlots = createAsyncThunk('auth/fetchStudentBookedSlots', async (studentId) => {
  const response = await apiCall('get', `${endpoints.FETCH_STUDENT_BOOKED_SLOTS}/${studentId}`);
  console.log(response.data);
  
  return response.data;

});

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    token: null,
    role: null,
    currentUser: null,
    bookedSlots: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.currentUser = action.payload.user;
    },
    clearAuth(state) {
      state.token = null;
      state.role = null;
      state.currentUser = null;
      state.bookedSlots = [];
    },
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.currentUser = action.payload.user;
      localStorage.setItem('st_token', action.payload.token);
    },
    authFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentData.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchStudentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchStudentBookedSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentBookedSlots.fulfilled, (state, action) => {
        state.bookedSlots = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchStudentBookedSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setAuth,
  clearAuth,
  authStart,
  authSuccess,
  authFailure,
  resetError,
} = studentSlice.actions;

export default studentSlice.reducer;
