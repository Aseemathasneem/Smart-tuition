import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { authSuccess } from '../redux/student/studentSlice';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../api/apiCalls'; 

export default function OAuth({ apiEndpoint }) {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const response = await apiCall("post", apiEndpoint, {
                name: resultsFromGoogle.user.displayName,
                email: resultsFromGoogle.user.email,
                googlePhotoUrl: resultsFromGoogle.user.photoURL,
            });

            if (response.status === 200) {
                const { accessToken, role } = response.data;

                dispatch(authSuccess({
                    token: accessToken,
                    role: role,
                    user: response.data,
                }));
                navigate('/student/home');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
            Continue with Google
        </Button>
    );
}
