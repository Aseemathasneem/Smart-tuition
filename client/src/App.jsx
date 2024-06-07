import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Student from './pages/Dashboard'
import OtpVerification from './pages/OtpVerification'
import Header from './components/Header'
import Tutor from './pages/Tutor'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'


export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/'element={<Home/>}/>
      <Route path='/sign-in'element={<SignIn/>}/>
      <Route path='/otp-verification' element={<OtpVerification />} />
      <Route path='/sign-up'element={<SignUp/>}/>
      <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      <Route path='/student'element={<Student/>}/>
      <Route path='/tutor'element={<Tutor/>}/>
     
     
    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}
