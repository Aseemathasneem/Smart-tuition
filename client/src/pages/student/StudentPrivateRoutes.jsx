// PrivateRoutes.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const token = localStorage.getItem('st_token'); 

  return token  ? <Outlet /> : <Navigate to="/student/home" />;
};

export default PrivateRoutes;
