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
  bookedSlots:[],
  availableSlots: [],
  students: [],
};

export const fetchStudents = createAsyncThunk('tutor/fetchStudents', async () => {
 
  const response = await apiCall('get', endpoints.FETCH_STUDENTLIST);
  console.log(response.data);
  
  return response.data;
});

export const fetchAvailableSlots = createAsyncThunk('tutor/fetchAvailableSlots', async (tutorId) => {
  const response = await apiCall('get',`${endpoints.FETCH_AVAILABLE_SLOTS}/${tutorId}`);
  console.log('response',response.data)
  return response.data;
});

export const deleteSlot = createAsyncThunk('tutor/deleteSlot', async (slotId) => {
  const response = await apiCall('delete',`${endpoints.DELETE_SLOT}/${slotId}`);
  return slotId;
});
export const updateSession = createAsyncThunk('tutor/updateSession', async ({ sessionId, date, startTime, endTime, tutorId }) => {
  const response = await apiCall('put', `${endpoints.UPDATE_SESSION}/${sessionId}`, {
    
    date,
    startTime,
    endTime,
    tutorId
  });
  return response.data;
});
export const updateSlot = createAsyncThunk('tutor/updateSlot', async ({ slotId, date, startTime, endTime ,tutorId}) => {
  const response = await apiCall('put', `${endpoints.UPDATE_SLOT}/${slotId}`, {
    date,
    startTime,
    endTime,
    tutorId
  });
  return response.data;
});

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
      console.log('response',response.data)
      return response.data; 

    } catch (error) {
      
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch booked slots');
    }
  }
);

export const cancelSession = createAsyncThunk(
  'tutor/cancelSession',
  async (sessionId, thunkAPI) => {
    try {
      const response = await apiCall('put', endpoints.CANCEL_SESSION(sessionId));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to cancel session');
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
      .addCase(cancelSession.fulfilled, (state, action) => {
        state.bookedSlots.sessions = state.bookedSlots.sessions.filter(
          (session) => session._id !== action.payload._id
        );
      })
      .addCase(cancelSession.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteSlot.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = state.availableSlots.filter(slot => slot._id !== action.payload);
      })
      .addCase(deleteSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSlot.fulfilled, (state, action) => {
        state.loading = false;
        // Update the slot in availableSlots
        const index = state.availableSlots.findIndex((slot) => slot._id === action.payload._id);
        if (index !== -1) {
          state.availableSlots[index] = action.payload;
        }
      })
      .addCase(updateSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.loading = false;
      
        
      
       
        if (Array.isArray(state.bookedSlots.sessions)) {
          // Find the index of the session to be updated
          const index = state.bookedSlots.sessions.findIndex(slot => slot.slotId._id === action.payload._id)
      
          if (index !== -1) {
            
            state.bookedSlots.sessions[index] = {
              ...state.bookedSlots.sessions[index],
              ...action.payload,
              slotId: {
                ...state.bookedSlots.sessions[index].slotId,
                date: action.payload.date,
                startTime: action.payload.startTime,
                endTime: action.payload.endTime
              },
              studentId: state.bookedSlots.sessions[index].studentId
            };
      
          }}
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
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
  updateTutorStatus,
  resetError,
} = tutorSlice.actions;

export default tutorSlice.reducer;
