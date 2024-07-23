// TutorLayout.js
import React from 'react';
import TutorHeader from '../components/tutorHeader';
import Footer from '../components/Footer';

const TutorLayout = ({ children }) => (
  <div>
    <TutorHeader />
    <main>{children}</main>
    <Footer />
  </div>
);

export default TutorLayout;
