import { Button, Navbar,Dropdown ,Avatar} from 'flowbite-react'
import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import {FaMoon,FaSun} from 'react-icons/fa'
import { useSelector,useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/student/studentSlice';


export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch()
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/student/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
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
      <div className='flex gap-2  md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill
        onClick={() => dispatch(toggleTheme())}>
         {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>{currentUser.name}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item  onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='student/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle/>
      </div>
      <Navbar.Collapse>
          <Navbar.Link active={path === '/'} as={'div'}>
            <Link to = '/'>
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/student'} as={'div'}>
            <Link to = '/student'>
              Student
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/tutor'} as={'div'}>
            <Link to = '/tutor'>
              Tutor
            </Link>
          </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>

  )
}
