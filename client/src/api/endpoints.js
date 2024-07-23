
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


   
   
  };
  
  export default endpoints;
  