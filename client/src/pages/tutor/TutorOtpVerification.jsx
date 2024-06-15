import { Alert, Button, Label, Spinner, TextInput, Toast } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiCall } from '../../utils/api';

export default function TutorOtpVerification() {
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
  
    useEffect(() => {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 8000);
  
      return () => clearTimeout(timer);
    }, []);
  
    const handleChange = (e) => {
      setOtp(e.target.value.trim());
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!otp) {
        return setErrorMessage('Please enter the OTP.');
      }
      try {
        setLoading(true);
        setErrorMessage(null);
        const response = await apiCall('post', '/tutor/verify-otp', { email, otp }); // Assuming the API endpoint for tutor OTP verification is '/tutor/verify-otp'
        if (response.data.success === false) {
          setErrorMessage(response.data.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        if (response.data.success) {
          navigate('/tutor/sign-in'); // Assuming the redirect path after successful verification for tutor is '/tutor/sign-in'
        }
      } catch (error) {
        if (error.response && error.response.data) {
          
          setErrorMessage(error.response.data.message);
        } else {
          // Network or other error
          setErrorMessage(error.message);
        }
        setLoading(false);
      }
    };
  
    const handleResendOtp = async () => {
      try {
        setLoading(true);
        setErrorMessage(null); // Clear any previous error messages
        setSuccessMessage(null); // Clear any previous success messages
  
        const data = await apiCall('post', '/tutor/resend-otp', { email }); // Assuming the API endpoint for resending OTP for tutor is '/tutor/resend-otp'
        setLoading(false);
  
        if (data.success === false) {
          setSuccessMessage(null); // Clear success message if there's an error
          setErrorMessage(data.message);
        } else {
          setErrorMessage(null); // Clear error message if successful
          setSuccessMessage('OTP has been resent successfully. Please check your email.');
        } 
      } catch (error) {
        if (error.response && error.response.data) {
          // Server provided error message
          setErrorMessage(error.response.data.message);
        } else {
          // Network or other error
          setErrorMessage(error.message);
        }
        setLoading(false);
      }
    };
  
    return (
      <div className='min-h-screen mt-20'>
        {showToast && (
          <div className="fixed top-5 right-5">
            <Toast className="bg-cyan-100 dark:bg-cyan-800 text-cyan-500 dark:text-cyan-200">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
                <HiInformationCircle className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">Check your mail to get your OTP.</div>
              <Toast.Toggle onClick={() => setShowToast(false)} />
            </Toast>
          </div>
        )}
        <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
          <div className='flex-1'>
            <img src='/images/pic1.jpg' alt='pic1' className='h-64 w-64' />
            <p className='text-sm mt-5'>
              Enter the OTP sent to your email to verify your account.
            </p>
          </div>
          <div className='flex-1'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div>
                <Label value='OTP' />
                <TextInput
                  type='text'
                  placeholder='Enter OTP'
                  value={otp}
                  onChange={handleChange}
                />
              </div>
              <div className='flex gap-4'>
                <Button
                  gradientDuoTone='purpleToBlue'
                  type='submit'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='pl-3'>Verifying...</span>
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
                <Button
                  gradientDuoTone='purpleToBlue'
                  outline
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='pl-3'>Resending...</span>
                    </>
                  ) : (
                    'Resend OTP'
                  )}
                </Button>
              </div>
            </form>
            {errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
            <Alert className='mt-5' color='success'>
              {successMessage}
            </Alert>
          )}
          </div>
        </div>
      </div>
    );
}
