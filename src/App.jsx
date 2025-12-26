import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './providers/AuthProvider';

const App = () => {
  useEffect(() => {
    // Check local storage immediately when the app loads
    const theme = localStorage.getItem('theme');
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;