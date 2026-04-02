import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/authContext.jsx';

const AprovalWidgets = () => {
  const { user, logout } = useAuth();
  const [available, setAvailable] = useState(null);
  const [rejectedLeaves, setRejectedLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/rejected-applications'); // Replace with your route
  };

  const handlePending = () => {
    navigate('/pending-applications'); // Replace with your route
  };

  const handleApproved = () => {
    navigate('/approved-applications'); // Replace with your route
  };
  const handleFaculty = () => {
    navigate('/faculty-on-leave'); // Replace with your route
  };

  useEffect(() => {
    if (!user) return; // Wait until user is loaded
    const fetchRejected = async () => {
      try {
        // const res = await fetch('/api/leaves/filter?status=Rejected');
        // const data = await res.json();
        // setRejectedLeaves(data.length);
        const res = await fetch(`/api/leaves/by-role?role=${user.role}&email=${user.email}`);
        const allLeaves = await res.json();

        // Filter only approved leaves
        const data = allLeaves.filter(leave => leave.status === 'Rejected');
        setRejectedLeaves(data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchPending = async () => {
      try {
        // const res = await fetch('/api/leaves/filter?status=Pending');
        // const data = await res.json();
        // if (user.role === 'hod') {
        //   const filteredData = data.filter(entry => entry.department === user.department);
        //   setPendingLeaves(filteredData.length);
        //   // console.log(filteredData);
        // } else {
        //   setPendingLeaves(data.length);
        //   // console.log(res.data);
        // }
        const res = await fetch(`/api/leaves/by-role?role=${user.role}&email=${user.email}`);
        const allLeaves = await res.json();

        // Filter only approved leaves
        const data = allLeaves.filter(leave => leave.status === 'Pending');
        setPendingLeaves(data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchApproved = async () => {
      try {
        // const res = await fetch('/api/leaves/filter?status=Approved');
        // const data = await res.json();
        // if (user.role === 'hod') {
        //   const filteredData = data.filter(entry => entry.department === user.department);
        //   setApprovedLeaves(filteredData.length);
        //   // console.log(filteredData);
        // } else {
        //   setApprovedLeaves(data.length);
        //   // console.log(res.data);
        // }
        const res = await fetch(`/api/leaves/by-role?role=${user.role}&email=${user.email}`);
        const allLeaves = await res.json();

        // Filter only approved leaves
        const data = allLeaves.filter(leave => leave.status === 'Approved');
        setApprovedLeaves(data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    axios.get('http://localhost:8089/api/leaves/active-leaves-count')
    .then(res => {
      if (user.role === 'hod') {
        const filteredData = res.data.filter(entry => entry.department === user.department);
        setAvailable(filteredData.length);
        // console.log(filteredData);
      } else {
        setAvailable(res.data.length);
        // console.log(res.data);
      }
    })
    .catch(err => console.error('Error fetching active leaves:', err));
    fetchRejected();
    fetchPending();
    fetchApproved();
  }, [user]);
  
  // const count = 47;
  return(
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 m-8">
        <div onClick={handlePending} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pending Requests</h3>
            <div className="p-2 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800 mb-2">{pendingLeaves}</p>
            <p className="text-sm text-gray-600">
              {pendingLeaves === 0 ? 'No pending requests' : 
               pendingLeaves === 1 ? 'Requests Pending' : 
               'Requests Pending'}
            </p>
          </div>
        </div>
        <div onClick={handleClick} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Rejected Requests</h3>
            <div className="p-2 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800 mb-2">{rejectedLeaves}</p>
            <p className="text-sm text-gray-600">
              {rejectedLeaves === 0 ? 'No pending requests' : 
               rejectedLeaves === 1 ? 'Requests Rejected' : 
               'Requests Rejected'}
            </p>
          </div>
        </div>
        <div onClick={handleApproved} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Accepted Requests</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800 mb-2">{approvedLeaves}</p>
            <p className="text-sm text-gray-600">
              {approvedLeaves === 0 ? 'No pending requests' : 
               approvedLeaves === 1 ? 'Requests Accepted' : 
               'Requests Accepted'}
            </p>
          </div>
        </div>
        <div onClick={handleFaculty} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Faculties on leave</h3>
            <div className="p-2 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800 mb-2">{available}</p>
            <p className="text-sm text-gray-600">
              {available === 0 ? 'All faculties available' : 
               available === 1 ? 'Faculty on leave' : 
               'Faculties on leave'}
            </p>
          </div>
        </div>
        
      </div>
      
  );
};

export default AprovalWidgets;