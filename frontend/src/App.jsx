import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from './components/layout/Layout';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'));

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        // Only show error if there's an actual error message
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        }
        return null;
      }
    },
    // Add staleTime to prevent unnecessary refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Only show loading spinner for protected routes
  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route 
            path='/' 
            element={
              isLoading ? <LoadingSpinner /> : 
              authUser ? <HomePage /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path='/signup' 
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />} 
          />
          <Route 
            path='/login' 
            element={!authUser ? <LoginPage /> : <Navigate to="/" />} 
          />
        </Routes>
      </Suspense>
      <Toaster />
    </Layout>
  );
}

export default App;
