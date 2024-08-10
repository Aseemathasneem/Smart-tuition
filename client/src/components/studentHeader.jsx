import React, { useEffect, useState } from 'react';
import { Button, Navbar, Dropdown, Avatar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaBell } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { clearAuth, fetchStudentData } from '../redux/student/studentSlice';
import { fetchSubjects } from '../redux/subjects/subjectsSlice';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:3000'); // Adjust URL as necessary

const StudentHeader = () => {
  const path = useLocation().pathname;
  const { currentUser, loading, error } = useSelector((state) => state.student);
  const { subjects } = useSelector((state) => state.subjects); // Get subjects from the Redux store
  const { theme } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.student);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('st_token');
    if (storedToken && !currentUser) {
      dispatch(fetchStudentData(storedToken));
    }
    dispatch(fetchSubjects()); // Fetch subjects when the component mounts
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (currentUser) {
      // Listen for real-time notifications
      socket.emit('join', currentUser._id);
      console.log('Joined room:', currentUser._id);

      socket.on('notification', (notification) => {
        console.log('Real-time notification received:', notification);
        setNotifications((prev) => [notification, ...prev]);
        toast.info('New notification received');
      });
    }

    return () => {
      if (currentUser) {
        socket.emit('leave', currentUser._id);
        console.log('Left room:', currentUser._id);
        socket.off('notification');
      }
    };
  }, [currentUser]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/student/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log('Signout failed:', data.message);
      } else {
        dispatch(clearAuth());
        localStorage.removeItem('st_token');
        window.location.href = '/student/home';
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className='border-b-2'>
      <Link to='/'>
        <img src='/images/logo.jpeg' alt='Logo' className='h-14 w-16' />
      </Link>
      <div className='flex gap-2 md:order-2'>
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        <Link to='/student/notifications'>
          <Button className='w-12 h-10' color='gray' pill>
            <FaBell />
            {notifications.length > 0 && (
              <span className="badge">{notifications.length}</span>
            )}
          </Button>
        </Link>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt='user' img={currentUser.profilePicture} rounded />}
          >
            <Dropdown.Header>
              <span className='block text-sm'>{currentUser.name}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </Dropdown.Header>
            <Link to='/student/profile'>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/student/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/student/home'} as={'div'}>
          <Link to='/student/home'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/student/profile'} as={'div'}>
          <Link to='/student/approved-tutors'>Tutors</Link>
        </Navbar.Link>
        <Dropdown
          label="Subjects"
          arrowIcon={false}
          inline
          className='ml-4'
        >
          {subjects.map((subject) => (
            <Link key={subject.id} to={`/student/subjects/${subject.id}`}>
              <Dropdown.Item>{subject.name}</Dropdown.Item>
            </Link>
          ))}
        </Dropdown>
        <Navbar.Link active={path === '/student/booked_sessions'} as={'div'}>
          <Link to='/student/booked_sessions'>Booked sessions</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/student/assignments'} as={'div'}>
          <Link to='/student/assignments'>Assignments</Link>
        </Navbar.Link>
      </Navbar.Collapse>
      <ToastContainer />
    </Navbar>
  );
};

export default StudentHeader;
