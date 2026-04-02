import React, { useEffect, useState } from 'react';
import SummaryWidgets from '../../components/faculty/SummaryWidgets';
import ApplyLeaveButton from '../../components/faculty/ApplyLeaveButton';
import MyApplicationsTable from '../../components/faculty/MyApplicationsTable';
// import { useAuth } from '@/contexts/authContext.jsx';
import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeaveHeader from '@/components/faculty/LeaveHeader';
import Sidebar from '../../components/Dash_hod/sidebar';
import ApprovalWidgets from '../../components/faculty/Approvalwidgets';

const FacultyDashboard = () => {
  // const { user, logout } = useAuth();
  const navigate = useNavigate();
  // const [showDropdown, setShowDropdown] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const handlePendingCount = (count) => {
    setPendingCount(count);
  };

  // const handleLogout = () => {
  //   logout();
  //   toast.success('Logged out successfully!');
  //   navigate('/login');
  // };
  return (
    <div>
  <Header />
  <div className="admin-dashboard" style={{ display: 'flex', minHeight: '80vh' }}>
    <div style={{ flexShrink: 0, width: '250px' }}>
      <Sidebar />
    </div>
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ flexGrow: 1 }}>
      <LeaveHeader />
      <ApplyLeaveButton />
      <SummaryWidgets count={pendingCount} />
      <MyApplicationsTable onPendingCount={handlePendingCount} />
    </div>
  </div>
  <Footer />
</div>

  );
};

export default FacultyDashboard;