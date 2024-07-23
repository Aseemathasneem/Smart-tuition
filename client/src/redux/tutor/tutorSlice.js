import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

const initialState = {
  token: null,
  role: null,
  currentUser: null,
  loading: false,
  error: null,
  tutors: [],
  bookedSlots:[]
};

// Async thunk action creator to fetch tutors
export const fetchTutors = createAsyncThunk(
  'tutor/fetchTutors',
  async (_, thunkAPI) => {
    try {
      const response = await apiCall('get', endpoints.GET_APPROVED_TUTORS);
      return response.data; // Assuming response.data is an array of tutors
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch tutors');
    }
  }
);
export const fetchTutorData = createAsyncThunk('auth/fetchTutorData', async (token) => {
  
  const response = await apiCall('get', endpoints.FETCH_TUTOR_DATA, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  return response.data;
});

export const fetchBookedSlots = createAsyncThunk(
  'tutor/fetchBookedSlots',
  async (tutorId, thunkAPI) => {
    try {
      const response = await apiCall('get', `${endpoints.FETCH_BOOKED_SLOTS}/${tutorId}`);
      console.log('API response:', response.data);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch booked slots');
    }
  }
);

const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
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
      localStorage.setItem('tu_token', action.payload.token);
    },
    authFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTutorStatus: (state, action) => {
      if (state.currentUser) {
        state.currentUser.status = action.payload;
      }
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.tutors = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tutors';
      })
      .addCase(fetchTutorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutorData.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTutorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tutor data';
      })
      .addCase(fetchBookedSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookedSlots.fulfilled, (state, action) => {
        state.bookedSlots = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBookedSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch booked slots';
      })
  },
});

export const {
  setAuth,
  clearAuth,
  authStart,
  authSuccess,
  authFailure,
  updateTutorStatus,
  resetError,
} = tutorSlice.actions;

export default tutorSlice.reducer;
