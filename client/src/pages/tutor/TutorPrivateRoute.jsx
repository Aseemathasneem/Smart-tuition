// PrivateRoutes.js
import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const token = localStorage.getItem('tu_token'); 


  return token  ? <Outlet /> : <Navigate to="/tutor/home" />;
};

export default PrivateRoutes;
