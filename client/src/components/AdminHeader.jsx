import React, { useEffect } from 'react';
import { Button, Navbar, Dropdown, Avatar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { fetchAdminData,clearAuth } from '../redux/admin/adminSlice';

export default function AdminHeader() {
  const path = useLocation().pathname;
  
  const { currentUser, loading, error } = useSelector((state) => state.admin);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  

  useEffect(() => {
    const storedToken = localStorage.getItem('ad_token');
   
    if (storedToken && !currentUser) {
      dispatch(fetchAdminData(storedToken)).then((result) => {
       
        
      });
    }
  }, [dispatch, currentUser]);

  


  const handleSignout = async () => {
    try {
      const res = await fetch('/api/admin/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log('Signout failed:', data.message);
      } else {
        dispatch(clearAuth());
        localStorage.removeItem('ad_token')
        window.location.href = '/admin/sign-in';
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
            <Link to='/admin/profile'>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Dropdown inline label={<Button gradientDuoTone='purpleToBlue' outline>Sign In</Button>}>
            <Link to='/admin/sign-in'>
              <Dropdown.Item>Admin</Dropdown.Item>
            </Link>
          </Dropdown>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/admin/profile'} as={'div'}>
          <Link to='/admin/profile'>Admin</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/admin/dashboard'} as={'div'}>
          <Link to='/admin/dashboard'>Dashboard</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/admin/approval-requests'} as={'div'}>
          <Link to='/admin/approval-requests'>Approval Requests</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
