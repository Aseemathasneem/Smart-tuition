import { Button, Navbar } from 'flowbite-react'
import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import {FaMoon} from 'react-icons/fa'

export default function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className='border-b-2'>
      <Link to='/'>
      <img src='/images/logo.jpeg' alt='Logo' className='h-14 w-16' />
      </Link>
      <div className='flex gap-2  md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
          <FaMoon/>
        </Button>
        <Link to='/sign-in'>
        <Button  gradientDuoTone="purpleToBlue"outline>
          Sign In
        </Button>
        </Link>
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
            <Link to = '/student'>
              Tutor
            </Link>
          </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>

  )
}
