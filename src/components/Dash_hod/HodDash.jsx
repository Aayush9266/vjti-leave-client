import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar'
import ApplyLeaveButton from '../faculty/ApplyLeaveButton';
import ApprovalWidgets from '../faculty/Approvalwidgets';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SummaryWidgets from '../faculty/SummaryWidgets';
import MyApplicationsTable from '../faculty/MyApplicationsTable';
import LeaveHeader from '../faculty/LeaveHeader';

export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState(0);

  const handlePendingCount = (count) => {
    setPendingCount(count);
  };
  return (
    <div>
      <Header/>
      
      <div className="admin-dashboard" style={{ display: 'flex' }}>
        <div><Sidebar /></div>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <LeaveHeader/>
          <ApprovalWidgets/>
          <ApplyLeaveButton />
          {/* <UpperDashboard /> */}
          <SummaryWidgets count={pendingCount}/>
          {/* <ApplyLeaveButton /> */}
          <MyApplicationsTable onPendingCount={handlePendingCount} />
        </div>

      </div>
      <Footer/>
    </div>
  );
}
