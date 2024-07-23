// PrivateRoutes.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const token = localStorage.getItem('ad_token'); 
  

  return token  ? <Outlet /> : <Navigate to="/admin/sign-in" />;
};

export default PrivateRoutes;
