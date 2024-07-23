import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CommonLayout = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

export default CommonLayout;