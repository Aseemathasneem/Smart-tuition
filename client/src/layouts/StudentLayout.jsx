// StudentLayout.js
import React from 'react';
import StudentHeader from '../components/studentHeader';
import Footer from '../components/Footer';

const StudentLayout = ({ children }) => (
  <div>
    <StudentHeader/>
    <main>{children}</main>
    <Footer />
  </div>
);

export default StudentLayout;
