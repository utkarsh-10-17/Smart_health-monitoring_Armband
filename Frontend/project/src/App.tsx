import React from 'react';
import LoginPage from './pages/LoginPage';
import AnalysisPage from './pages/AnalysisPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? <AnalysisPage /> : <LoginPage />}
    </div>
  );
}

export default App;