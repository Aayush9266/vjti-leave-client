import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Dash_hod/sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';
import { useAuth } from '@/contexts/authContext.jsx';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantLeaves, setApplicantLeaves] = useState([]);
  const [formDetails, setFormDetails] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const [selectedNotification, setSelectedNotification] = useState(null); // already exists
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [remark, setRemark] = useState('');
  const [currentLeaveId, setCurrentLeaveId] = useState(null);

  useEffect(() => {
    if (user) {
      const { email, role, department } = user;

      fetch(`http://localhost:8089/api/notifications/unread?email=${email}&role=${role}&department=${department}&unreadOnly=true`)
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch((err) => console.error('Error fetching notifications:', err));
    }
  }, [refresh]);

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      await axios.put('http://localhost:8089/api/notifications/mark-read', {
    email: user.email,
    role: user.role
  });
     console.log('clicked mark all read')
      setRefresh(prev => !prev); // to reload notifications

    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };


  const markRoleNullAsRead = async (email) => {
    if (!email) return;
    try {
      await fetch('http://localhost:8089/api/notifications/mark-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, markByRoleOnly: true }),
      });
      setRefresh(prev => !prev);
    } catch (err) {
      console.error('Error marking role=null as read:', err);
    }
  };

  const markAsRead = async (notificationId, role) => {
    if (!notificationId) return;
    try {
      const res = await fetch(`http://localhost:8089/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        role: role
      });

      const data = await res.json(); // get response
      console.log('Mark as read response:', res.status, data);

      if (res.ok) {
        setRefresh(prev => !prev); // trigger UI update
      } else {
        console.error('Failed to mark as read:', data.message || data);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };



  const fetchLeavesByEmail = async (email) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8089/api/leaves/by-email?email=${email}`);
      const data = await res.json();

      const pending = data
        .filter(leave => leave.status === 'Pending')
        .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate));

      setApplicantLeaves(pending);
      setSelectedApplicant(email);

    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success': return 'bg-gradient-to-r from-green-50 to-green-100 border-green-400 text-green-800 hover:from-green-100 hover:to-green-200';
      case 'error': return 'bg-gradient-to-r from-red-50 to-red-100 border-red-400 text-red-800 hover:from-red-100 hover:to-red-200';
      case 'info':
      default: return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 text-blue-800 hover:from-blue-100 hover:to-blue-200';
    }
  };

  const handleViewForm = (leave) => {
    setFormDetails(leave);
    setShowModal(true);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8089/api/leaves/${id}/status`, {
        status: newStatus,
        approvedBy: user.role
      });
      fetchLeavesByEmail(selectedApplicant);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Function to highlight applicant names in notification messages
  const highlightApplicantName = (message, applicantEmail) => {
    if (!applicantEmail) return message;
    
    // Extract name from email (assuming format like "john.doe@example.com")
    const namePart = applicantEmail.split('@')[0];
    const name = namePart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Highlight the name in the message
    const highlightedMessage = message.replace(
      new RegExp(`(${name}|${applicantEmail})`, 'gi'),
      '<span class="font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-md">$1</span>'
    );
    
    return highlightedMessage;
  };

  const handleActionClick = (leaveId, action) => {
    setCurrentLeaveId(leaveId);
    setCurrentAction(action);
    setRemark('');
    setShowRemarkModal(true);
  };

  const handleSubmitAction = async () => {
    try {
      const response = await axios.put(`http://localhost:8089/api/leaves/${currentLeaveId}/status`, {
        status: currentAction,
        approvedBy: user.role,
        remarks: remark.trim() || undefined
      });

      setPendingLeaves(prev =>
        prev.map(l => l._id === currentLeaveId ? {
          ...l,
          status: currentAction,
          approvedBy: user.role,
          remarks: remark.trim() || undefined
        } : l)
      );

      setShowRemarkModal(false);
      setCurrentLeaveId(null);
      setCurrentAction('');
      setRemark('');
      // Show success message
      alert(`Application ${currentAction.toLowerCase()} successfully!`);
      fetchLeavesByEmail(selectedApplicant);
    } catch (error) {
      console.error('Error updating leave status:', error);
      alert('Failed to update leave status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Manage your notifications and pending applications</p>
              </div>
              <button
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                onClick={markAllAsRead}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark All as Read
              </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5V12h-5l5-5v10z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Unread Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Selected Applicant</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedApplicant ? selectedApplicant.split('@')[0] : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5V12h-5l5-5v10z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! No new notifications to show.</p>
            </div>
          ) : (
            <div className={`${selectedApplicant ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}`}>
              {/* Notifications Panel */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
                  <p className="text-sm text-gray-600 mt-1">Click on a notification to view pending applications</p>
                </div>
                
                <div className="p-6 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`cursor-pointer border-l-4 p-4 rounded-lg shadow-sm transition-all duration-200 ${getNotificationStyle(notification.type)} ${
                        selectedApplicant === notification.applicantEmail ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''
                      }`}
                      onClick={async () => {
                        // ✅ If a different notification was already open, mark it as read
                        if (
                          selectedNotification &&
                          selectedNotification._id !== notification._id &&
                          !selectedNotification.read
                        ) {
                          await markAsRead(selectedNotification._id, user.role);
                        }
                      
                        // ✅ Now update state with the new notification
                          setSelectedNotification(notification);
                        if(user.role != 'faculty' && notification.receiverRole !== null){
                          setSelectedApplicant(notification.applicantEmail);
                          await fetchLeavesByEmail(notification.applicantEmail);
                          setShowModal(true); // or however you're showing the form
                        } 
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold">{notification.title}</h3>
                            {notification.type === 'success' && (
                              <svg className="w-5 h-5 text-green-600 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                            {notification.type === 'error' && (
                              <svg className="w-5 h-5 text-red-600 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div 
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: highlightApplicantName(notification.message, notification.applicantEmail)
                            }}
                          />
                          {notification.applicantEmail && (
                            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              {notification.applicantEmail}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end ml-4">
                          <div className="text-xs text-gray-500 mb-2">
                            {new Date(notification.date).toLocaleDateString()}
                          </div>
                          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Applications Panel - Only shows when selectedApplicant exists */}
              {selectedApplicant && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Pending Applications</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Applications from <span className="font-medium text-indigo-600">{selectedApplicant}</span>
                    </p>
                  </div>

                  <div className="p-6">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading applications...</p>
                      </div>
                    ) : applicantLeaves.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
                        <p className="text-gray-600">All applications have been processed</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                        {applicantLeaves.map((leave) => (
                          <div key={leave._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {leave.leavetype || leave.leaveType}
                                  </span>
                                  <span className="ml-2 text-sm text-gray-600">
                                    {leave.assignmentDays || leave.days} days
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-700">From:</span>
                                    <p className="text-gray-600">{new Date(leave.fromDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">To:</span>
                                    <p className="text-gray-600">{new Date(leave.toDate).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                              <button
                                onClick={() => handleViewForm(leave)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Details
                              </button>
                              <button
                                onClick={() => handleActionClick(leave._id, 'Approved')}
                                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </button>
                              <button
                                onClick={() => handleActionClick(leave._id, 'Rejected')}
                                className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Modal */}
          {showModal && formDetails && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white">Leave Application Details</h2>
                  <p className="text-indigo-100 text-sm mt-1">Review the complete application form</p>
                </div>
                
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Applicant Name</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{formDetails.name}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <p className="mt-1 text-gray-900">{formDetails.email}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Department</label>
                        <p className="mt-1 text-gray-900">{formDetails.department}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Leave Type</label>
                        <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {formDetails.leavetype || formDetails.leaveType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">From Date</label>
                        <p className="mt-1 text-gray-900">{new Date(formDetails.fromDate).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">To Date</label>
                        <p className="mt-1 text-gray-900">{new Date(formDetails.toDate).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Number of Days</label>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{formDetails.assignmentDays || formDetails.days}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Current Status</label>
                        <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          {formDetails.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700">Reason for Leave</label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                      <p className="text-gray-900">{formDetails.reason || 'No reason provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <button
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          {showRemarkModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">
                  {currentAction === 'Approved' ? 'Approve Application' : 'Reject Application'}
                </h2>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  You are about to {currentAction.toLowerCase()} this leave application.
                  {currentAction === 'Approved' ? ' Please provide any feedback or comments.' : ' Please provide a reason for rejection.'}
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks (Optional)
                  </label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="4"
                    placeholder={currentAction === 'Approved' ? "Add any feedback or comments..." : "Please provide reason for rejection..."}
                    maxLength="500"
                  />

                  <div className="text-xs text-gray-500 mt-1">
                    {remark.length}/500 characters
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowRemarkModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAction}
                    className={`px-4 py-2 text-white rounded transition-colors ${currentAction === 'Approved'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                      }`}
                  >
                    {currentAction === 'Approved' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}