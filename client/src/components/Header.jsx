import React from 'react';
import { Button, Navbar, Dropdown } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';

export default function Header() {
  const path = useLocation().pathname;
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return (
    <Navbar className='border-b-2 '>
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
        <Dropdown inline label={<Button gradientDuoTone='purpleToBlue' outline>Sign In</Button>}>
          <Link to='/student/sign-in'>
            <Dropdown.Item>Student</Dropdown.Item>
          </Link>
          <Link to='/tutor/sign-in'>
            <Dropdown.Item>Tutor</Dropdown.Item>
          </Link>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/student/profile'} as={'div'}>
          <Link to='/student/profile'>Student</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/tutor/profile'} as={'div'}>
          <Link to='/tutor/profile'>Tutors</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
    
  );
}
