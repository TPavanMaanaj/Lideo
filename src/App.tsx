import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import MainLayout from './components/Layout/MainLayout';
import CourseMaterials from './components/Courses/CourseMaterials'; // 👈 create this component
import AddTopicsPage from './components/Courses/AddTopicsPage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <Routes>
      {user ? (
        <>
          {/* Main application routes */}
          {/* <Route path="/superadmincodelogin" element={<SuperAdminCodeLogin onBackToLogin={()=> navigate('/')}/>} /> */}
          <Route path="/" element={<MainLayout />} />
          <Route path="/course/:courseId/materials" element={<CourseMaterials />} />
          <Route path="/add-topics/:courseId/:instructorId/:universityId" element={<AddTopicsPage />} />
          {/* Add more routes as needed */}
        </>
      ) : (
        <Route path="*" element={<LoginForm />} />
      )}
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
