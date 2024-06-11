import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/common/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import StudentRoutes from './routes/StudentRoutes';
// import TutorRoutes from './routes/TutorRoutes';
// import AdminRoutes from './routes/AdminRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<StudentRoutes />} />
        {/* <Route path="/*" element={<TutorRoutes />} />
        <Route path="/*" element={<AdminRoutes />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
