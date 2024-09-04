import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import OAuth from '../../components/OAuth';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

export default function StudentSignUp() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required')
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setErrorMessage(null);

                const response = await apiCall('post', endpoints.STUDENT_SIGN_UP, values);
                setLoading(false);

                if (response.data.success === false) {
                    setErrorMessage(response.data.message);
                } else {
                    navigate(endpoints.STUDENT_GET_OTP_VERIFICATION, { state: { email: values.email } });
                }
            } catch (error) {
                setErrorMessage(error.response?.data?.message || error.message || 'An error occurred');
                setLoading(false);
            }
        }
    });

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
                    <form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>
                        <div>
                            <Label value='Your name' />
                            <TextInput
                                type='text'
                                placeholder='Name'
                                id='name'
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className='text-red-500 text-sm'>{formik.errors.name}</div>
                            ) : null}
                        </div>
                        <div>
                            <Label value='Your email' />
                            <TextInput
                                type='email'
                                placeholder='Email'
                                id='email'
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className='text-red-500 text-sm'>{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div>
                            <Label value='Your password' />
                            <TextInput
                                type='password'
                                placeholder='Password'
                                id='password'
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className='text-red-500 text-sm'>{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div>
                            <Label value='Confirm your password' />
                            <TextInput
                                type='password'
                                placeholder='Confirm Password'
                                id='confirmPassword'
                                {...formik.getFieldProps('confirmPassword')}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className='text-red-500 text-sm'>{formik.errors.confirmPassword}</div>
                            ) : null}
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
                                'Sign Up'
                            )}
                        </Button>
                        <OAuth apiEndpoint={endpoints.STUDENT_GOOGLE_SIGNIN} />
                    </form>
                    <div className='flex gap-2 text-sm mt-5'>
                        <span>Have an account?</span>
                        <Link to='/student/sign-in' className='text-blue-500'>
                            Sign In
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
