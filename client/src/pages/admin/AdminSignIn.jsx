import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import OAuth from '../../components/OAuth';
import {
  authStart,
  authSuccess,
  authFailure,
  resetError
} from '../../redux/admin/adminSlice'; // Adjust the import path if needed
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

export default function AdminSignIn() {
  const { loading, error: errorMessage, currentUser } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    dispatch(resetError()); // Clear error on mount

    return () => {
      dispatch(resetError()); // Clear error on unmount
    };
  }, [dispatch]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      navigate('/admin/dashboard'); // Navigate to admin dashboard if already signed in
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
      const response = await apiCall('post', endpoints.ADMIN_SIGN_IN, formData);
      
      if (response.data.success === false) {
        dispatch(authFailure(response.data.message));
      } else {
       
        dispatch(authSuccess({
          token: response.data.accessToken,
          
          role:  response.data.role,
          user: response.data,
        }));
        navigate('/admin/dashboard'); // Navigate to admin dashboard on success
      }
    } catch (error) {
      dispatch(authFailure(error.response?.data?.message || error.message));
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* Left */}
        <div className='flex-1'>
          <img src='/images/pic1.jpg' alt='pic1' className='h-64 w-64' />
          <p className='text-sm mt-5'>
            Ready to manage the platform? Sign in now to access the admin dashboard and start managing users, content, and more!
          </p>
        </div>
        {/* Right */}
        <div className='flex-1'>
          <h2 className='text-2xl font-bold mb-5'>Admin Sign in</h2>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='Email'
                id='email'
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='*********'
                id='password'
                value={formData.password}
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
            <OAuth apiEndpoint="/api/admin/google-signin" />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/admin/sign-up' className='text-blue-500'>
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
