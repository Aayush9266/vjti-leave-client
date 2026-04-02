import React, { useState, useEffect } from 'react';
import FacultyAPI from '../../services/facultyAPI';

const SummaryWidgets = ({count}) => {
  const [leaveBalance, setLeaveBalance] = useState({});
  const [pendingRequests, setPendingRequests] = useState(0);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceRes, pendingRes, calendarRes] = await Promise.all([
        FacultyAPI.getLeaveBalance(),
        FacultyAPI.getPendingRequests(),
        FacultyAPI.getCalendarEvents()
      ]);

      setLeaveBalance(balanceRes?.success ? balanceRes.data?.data || balanceRes.data || {} : {});
      setPendingRequests(pendingRes?.success ? pendingRes.data?.count || 0 : 0);
      setCalendarEvents(calendarRes?.success ? calendarRes.data || [] : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Leave Balance Widget */}
      <div className="bg-white rounded-lg p-6 border-l-4 border-red-500 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Leave Balance</h3>
          <div className="p-2 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m0 0V7a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Casual Leave</span>
            <span className="font-medium text-gray-800">{leaveBalance.casual || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Emergency/Sick Leave</span>
            <span className="font-medium text-gray-800">{leaveBalance.emergency || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Special/Duty Leave</span>
            <span className="font-medium text-gray-800">{leaveBalance.SlDl || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Earned Leave</span>
            <span className="font-medium text-gray-800">{leaveBalance.earned || 0}</span>
          </div>
        </div>
      </div>

      {/* Pending Requests Widget */}
      <div className="bg-white rounded-lg p-6 border-l-4 border-yellow-500 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Pending Requests</h3>
          <div className="p-2 bg-yellow-100 rounded-full">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800 mb-2">{count}</p>
          <p className="text-sm text-gray-600">
            {count === 0 ? 'No pending requests' : 
             count === 1 ? 'Request awaiting approval' : 
             'Requests awaiting approval'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryWidgets;