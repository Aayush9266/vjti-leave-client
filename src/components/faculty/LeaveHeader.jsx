import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LeaveReportPDFContainer from "./LeaveReportPDFContainer";

const LeaveHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };
  // Get current month in YYYY-MM format
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return (
    
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leave Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your leave applications and view your balance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              {/* <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div> */}
              <div>
                <div
                  className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                {showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      marginTop: '10px',
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      padding: 8,
                      minWidth: '200px'
                    }}
                  >
                    <h2 style={{ marginBottom: '8px' }}>User Profile</h2>
                    <div style={{ fontSize: '14px' }}>
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Department:</strong> {user.department}</p>
                      <p><strong>Position:</strong> {user.position || "Not specified"}</p>
                      <p><strong>Role:</strong> {user.role}</p>
                      <p><strong>ID:</strong> {user.id}</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div style={{
                      marginLeft: 16,
                      padding: 8,
                      background: '#800E13',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}>
                  <LeaveReportPDFContainer facultyId={user?.id} month={month} />
                </div>
              </div>
              <div>
                  <button
                    onClick={handleLogout}
                    style={{
                      marginLeft: 16,
                      padding: 8,
                      background: '#800E13',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Logout
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LeaveHeader;