import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Student from './pages/Student'
import Header from './components/Header'
import Tutor from './pages/Tutor'


export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/'element={<Home/>}/>
      <Route path='/sign-in'element={<SignIn/>}/>
      <Route path='/sign-up'element={<SignUp/>}/>
      <Route path='/student'element={<Student/>}/>
      <Route path='/tutor'element={<Tutor/>}/>
     
     
    </Routes>
    </BrowserRouter>
  )
}
