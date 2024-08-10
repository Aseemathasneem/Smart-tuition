import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure, resetError } from '../../redux/student/studentSlice';
import OAuth from '../../components/OAuth';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

export default function StudentSignIn() {
  const navigate = useNavigate();
  const { currentUser, loading, error: errorMessage } = useSelector((state) => state.student);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetError()); // Clear error on mount

    return () => {
      dispatch(resetError()); // Clear error on unmount
    };
  }, [dispatch]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      navigate('/student/home'); 
    }
  }, [currentUser, navigate]);

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(authFailure('Please fill all the fields'));
    }
    try {
      dispatch(authStart());
      const response = await apiCall('post', endpoints.STUDENT_SIGN_IN, formData);
      
      if (response.data.success === false) {
        dispatch(authFailure(response.data.message));
      } else {
       
        dispatch(authSuccess({
          token: response.data.accessToken,
          
          role:  response.data.role,
          user: response.data,
        }));
        navigate('/student/home');
      }
    } catch (error) {
      dispatch(authFailure(error.response?.data?.message || error.message));
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <img src='/images/pic1.jpg' alt='pic1' className='h-64 w-64' />
          <p className='text-sm mt-5'>
            Ready to excel in your studies? Register now and gain access to expert tutors and tailored learning plans!!
          </p>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='Email'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='*********'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone='purpleToBlue'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth apiEndpoint="/api/student/google-signin" />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/student/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
