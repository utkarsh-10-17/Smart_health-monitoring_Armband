import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { LogOut, BarChart4 } from 'lucide-react';

const Header: React.FC = () => {
  const { username, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BarChart4 className="h-8 w-8 text-primary-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Logged in as <span className="font-medium text-gray-900">{username}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;