import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

const initialState = {
  currentUser: null,
  token: null,
  role: null,
  students: [],
  tutors: [],
  approvalRequests: [],
  error: null,
  loading: false,
  successMessage: '',
};

export const fetchAdminData = createAsyncThunk('auth/fetchAdminData', async (token) => {
 
  const response = await apiCall('get', endpoints.FETCH_ADMIN_DATA, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  return response.data;
});

export const fetchStudents = createAsyncThunk('admin/students', async () => {
  const response = await apiCall('get', endpoints.FETCH_STUDENTS);
  return response.data;
});

export const blockStudent = createAsyncThunk('admin/blockStudent', async (studentId) => {
  await apiCall('post', endpoints.BLOCK_STUDENT, { studentId });
  return studentId;
});

export const unblockStudent = createAsyncThunk('admin/unblockStudent', async (studentId) => {
  await apiCall('post', endpoints.UNBLOCK_STUDENT, { studentId });
  return studentId;
});

// Fetch tutors
export const fetchTutors = createAsyncThunk('admin/tutors', async () => {
  const response = await apiCall('get', endpoints.FETCH_TUTORS);
  return response.data;
});

// Block tutor
export const blockTutor = createAsyncThunk('admin/blockTutor', async (tutorId) => {
  await apiCall('post', endpoints.BLOCK_TUTOR, { tutorId });
  return tutorId;
});

// Unblock tutor
export const unblockTutor = createAsyncThunk('admin/unblockTutor', async (tutorId) => {
  await apiCall('post', endpoints.UNBLOCK_TUTOR, { tutorId });
  return tutorId;
});


export const fetchApprovalRequests = createAsyncThunk('admin/fetchApprovalRequests', async () => {
  const response = await apiCall('get', endpoints.FETCH_APPROVAL_REQUESTS);
  return response.data;
});

export const approveRequest = createAsyncThunk('admin/approveRequest', async (requestId) => {
  await apiCall('post', endpoints.APPROVE_REQUEST, { requestId });
  return requestId;
});

export const rejectRequest = createAsyncThunk('admin/rejectRequest', async ({ requestId, reason }) => {
  await apiCall('post', endpoints.REJECT_REQUEST, { requestId, reason });
  return { requestId, reason };
});

const adminSlice = createSlice({
  name: 'admin',
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
      localStorage.setItem('ad_token', action.payload.token);
    },
    authFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetError(state) {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = ''; 
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchAdminData.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAdminData.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    })
    .addCase(fetchAdminData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
      // Fetch students
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
      })
      // Fetch tutors
      .addCase(fetchTutors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = action.payload;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Block student
      .addCase(blockStudent.fulfilled, (state, action) => {
        const studentId = action.payload;
        const student = state.students.find((student) => student._id === studentId);
        if (student) {
          student.isBlocked = true;
        }
      })
      .addCase(blockStudent.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Unblock student
      .addCase(unblockStudent.fulfilled, (state, action) => {
        const studentId = action.payload;
        const student = state.students.find((student) => student._id === studentId);
        if (student) {
          student.isBlocked = false;
        }
      })
      .addCase(unblockStudent.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Block tutor
      .addCase(blockTutor.fulfilled, (state, action) => {
        const tutorId = action.payload;
        const tutor = state.tutors.find((tutor) => tutor._id === tutorId);
        if (tutor) {
          tutor.isBlocked = true;
        }
      })
      .addCase(blockTutor.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Unblock tutor
      .addCase(unblockTutor.fulfilled, (state, action) => {
        const tutorId = action.payload;
        const tutor = state.tutors.find((tutor) => tutor._id === tutorId);
        if (tutor) {
          tutor.isBlocked = false;
        }
      })
      .addCase(unblockTutor.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Fetch approval requests
      .addCase(fetchApprovalRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovalRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.approvalRequests = action.payload;
      })
      .addCase(fetchApprovalRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Approve request
      .addCase(approveRequest.fulfilled, (state, action) => {
        const requestId = action.payload;
        const request = state.approvalRequests.find((request) => request._id === requestId);
        if (request) {
          request.status = 'approved';
        }
        state.successMessage = 'Tutor approved successfully';
      })
      .addCase(approveRequest.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Reject request
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const { requestId, reason } = action.payload;
        const request = state.approvalRequests.find((request) => request._id === requestId);
        if (request) {
          request.status = 'rejected';
          request.rejectionReason = reason; // Store the rejection reason if needed
        }
        state.successMessage = 'Tutor rejected successfully';
      })
      .addCase(rejectRequest.rejected, (state, action) => {
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
  clearSuccessMessage,
} = adminSlice.actions;

export default adminSlice.reducer;
