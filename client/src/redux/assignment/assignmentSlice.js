import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

export const createAssignment = createAsyncThunk('assignment/createAssignment', async (assignmentData) => {
  const response = await apiCall('post', endpoints.CREATE_ASSIGNMENT, assignmentData);
  return response.data;
});

export const fetchStudentAssignments = createAsyncThunk('assignment/fetchStudentAssignments', async (studentId) => {
  const response = await apiCall('get', `${endpoints.FETCH_STUDENT_ASSIGNMENTS}/${studentId}`);
 
  
  return response.data;
});
export const submitAssignmentAnswer = createAsyncThunk('assignment/submitAssignmentAnswer', async (formData) => {
  const response = await apiCall('post', endpoints.SUBMIT_ASSIGNMENT_ANSWER, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
});
export const fetchSubmittedAssignments = createAsyncThunk('assignment/fetchSubmittedAssignments', async (tutorId) => {
  const response = await apiCall('get', `${endpoints.FETCH_SUBMITTED_ASSIGNMENTS}/${tutorId}`);
  console.log('Fetched submitted assignments:', response.data);
  return response.data;
});


export const gradeSubmission = createAsyncThunk(
  'assignment/gradeSubmission',
  async ({ submissionId, grade, remarks }) => {
    const response = await apiCall('patch', `${endpoints.GRADE_SUBMISSION}/${submissionId}`, {
      grade,
      remarks,  // Include remarks in the request body
      status: 'verified'
    });
    return response.data;
  }
);


const assignmentSlice = createSlice({
  name: 'assignment',
  initialState: { assignments: [],studentAssignments: [],submissionStatus: {} ,submittedAssignments: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchStudentAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentAssignments.fulfilled, (state, action) => {
        state.loading = false;
        
        state.studentAssignments = action.payload;
      })
      .addCase(fetchStudentAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(submitAssignmentAnswer.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitAssignmentAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionStatus[action.meta.arg.get('assignmentId')] = 'submitted';
      })
      .addCase(submitAssignmentAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSubmittedAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubmittedAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.submittedAssignments = action.payload;
      })
      .addCase(fetchSubmittedAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        const { submissionId, grade } = action.payload;
        const assignment = state.submittedAssignments.find(assignment =>
          assignment.submissions.some(submission => submission._id === submissionId)
        );
        if (assignment) {
          const submission = assignment.submissions.find(sub => sub._id === submissionId);
          if (submission) {
            submission.grade = grade;
            submission.status = 'verified';
          }
        }
      });



  },
});

export default assignmentSlice.reducer;
