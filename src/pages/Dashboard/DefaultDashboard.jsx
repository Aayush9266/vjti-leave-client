import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function DefaultDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div>
      DefaultDashboard
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
  );
}

export default DefaultDashboard;
