import React, { useEffect } from 'react';
import { Button, Navbar, Dropdown, Avatar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';

import { clearAuth, resetError,fetchStudentData } from '../redux/student/studentSlice';

const StudentHeader = () => {
  const path = useLocation().pathname;
  const { currentUser, loading, error } = useSelector((state) => state.student);
  
  const { theme } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.student);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('st_token');
   
    if (storedToken && !currentUser) {
      dispatch(fetchStudentData(storedToken));
    }
  }, [dispatch, currentUser]);

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
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/student/profile'} as={'div'}>
          <Link to='/student/approved-tutors'>Tutors</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default StudentHeader;
