
const endpoints = {
   
    STUDENT_SIGN_UP: '/student/signup',
    STUDENT_GET_OTP_VERIFICATION:'/student/otp-verification',
    STUDENT_POST_OTP_VERIFICATION:'/student/verify-otp',
    STUDENT_RESEND_OTP:'/student/resend-otp',
    STUDENT_SIGN_IN:'/student/signin',
    FETCH_STUDENTS_DATA:'/student/user-info',
    GET_APPROVED_TUTORS:'/student/approved-tutors',
    GET_TUTOR_DETAILS: (tutorId) => `/student/tutors/${tutorId}`,
    BOOK_SLOT : '/student/book_slot',
    FETCH_STUDENT_BOOKED_SLOTS :'/student/booked-slots',
    STUDENT_SUBMIT_REVIEW : '/student/submit_review',
    GET_TUTOR_REVIEWS: (tutorId) => `/student/reviews/tutor/${tutorId}`,
    GET_STUDENT_NOTIFICATIONS: (userId) => `/student/notifications/${userId}`,
    GET_SLOTS_BY_DATE: (tutorId) => `/student/get_slot_byDate/${tutorId}`,
   
    MARK_ATTENDANCE: (sessionId) => `/sessions/${sessionId}/leave`,
    FETCH_STUDENT_ASSIGNMENTS: '/student/assignments',
    SUBMIT_ASSIGNMENT_ANSWER: '/student/submit-answer',
    GET_TOP_TUTORS:'/student/top-tutors',


   TUTOR_SIGN_UP: '/tutor/signup',
    TUTOR_GET_OTP_VERIFICATION:'/tutor/otp-verification',
    TUTOR_POST_OTP_VERIFICATION:'/tutor/verify-otp',
    TUTOR_RESEND_OTP:'/tutor/resend-otp',
    TUTOR_SIGN_IN:'/tutor/signin',
    FETCH_TUTOR_DATA:'/tutor/user-info',
    TUTOR_PROFILE_UPDATE:'/tutor/profile-update',
    TUTOR_GET_PROFILE:'tutor/profile',
    SAVE_AVAILABILITY:'tutor/save-availability',
    TUTOR_FETCH_SUBJECTS : '/tutor/subjects',
    FETCH_BOOKED_SLOTS :'/tutor/booked-slots',
    FETCH_AVAILABLE_SLOTS :'/tutor/available-slots',
    DELETE_SLOT :'/tutor/delete-slot',
    UPDATE_SLOT :'/tutor/update-slot',
    UPDATE_SESSION:'/tutor/update-session',
    CANCEL_SESSION: (sessionId) => `/tutor/cancel/${sessionId}`,
    GET_TUTOR_NOTIFICATIONS: (userId) => `/tutor/notifications/${userId}`,
    POST_ASSIGNMENT: '/tutor/post-assignment',
    FETCH_STUDENTLIST :'/tutor/students',
    CREATE_ASSIGNMENT: '/tutor/create-assignment',
    FETCH_SUBMITTED_ASSIGNMENTS:'/tutor/submitted-answers',
    GET_TUTOR_REVENUE: (tutorId) => `/tutor/tutor-revenue/${tutorId}`,
    GET_STUDENT_COUNT_BY_TUTOR: (tutorId) => `/tutor/distinct-students/${tutorId}`,
    GET_TUTOR_HOURS: (tutorId) => `/tutor/tutor-hours/${tutorId}`,
    GET_TUTOR_PAYMENT_DETAILS:(tutorId) => `/tutor/tutor-payments/${tutorId}`,
    GRADE_SUBMISSION:'/tutor/submissions',
    VERIFY_TOKEN: '/tutor/verify-token',
    GET_TUTOR_STATUS:'/tutor/blocked_status',
    





    ADMIN_SIGN_UP: '/admin/signup',
   ADMIN_GET_OTP_VERIFICATION:'/admin/otp-verification',
    ADMIN_POST_OTP_VERIFICATION:'/admin/verify-otp',
    ADMIN_RESEND_OTP:'/admin/resend-otp',
    ADMIN_SIGN_IN:'/admin/signin',
    FETCH_ADMIN_DATA:'/admin/user-info',
    FETCH_STUDENTS: '/admin/students',
  BLOCK_STUDENT: '/admin/students/block',
  UNBLOCK_STUDENT: '/admin/students/unblock',
  FETCH_TUTORS: '/admin/tutors',
  BLOCK_TUTOR:'/admin/tutors/block',
  UNBLOCK_TUTOR:'/admin/tutors/unblock',
  FETCH_APPROVAL_REQUESTS:'/admin/approvalRequests',
  APPROVE_REQUEST:'/admin/approvalRequests/approve',
  REJECT_REQUEST:'/admin/approvalRequests/reject',
  FETCH_SUBJECTS : '/admin/subjects',
  ADD_SUBJECT : '/admin/add-subject',
  UPDATE_SUBJECT:'/admin/update-subject',
  DELETE_SUBJECT :'/admin/delete-subject',
  GET_TOTAL_REVENUE:'/admin/admin-revenue',
  GET_TOTAL_STUDENTS: '/admin/total-students',
  GET_TOTAL_TUTORS: '/admin/total-tutors',
  GET_ALL_PAYMENT_DETAILS:'/admin/payment-details',
  


   
   
  };
  
  export default endpoints;
  