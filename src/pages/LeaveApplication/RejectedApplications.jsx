import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaSearch } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/authContext.jsx';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#FF7F50'];

export default function RejectedApplications() {
  const { user, logout } = useAuth();
  const [rejectedLeaves, setRejectedLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formDetails, setFormDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterLeaveType, setFilterLeaveType] = useState('');

  useEffect(() => {
    const fetchRejected = async () => {
      try {
        // const res = await fetch('/api/leaves/filter?status=Rejected');
        // const data = await res.json();
        const res = await fetch(`/api/leaves/by-role?role=${user.role}&email=${user.email}`);
        const allLeaves = await res.json();

        // Filter only approved leaves
        const data = allLeaves.filter(leave => leave.status === 'Rejected');
        setRejectedLeaves(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRejected();
  }, [user]);

  // Prepare data for Pie Chart - count rejected by leave type
  const chartData = rejectedLeaves.reduce((acc, leave) => {
    const type = leave.leavetype || 'Unknown';
    const found = acc.find((item) => item.name === type);
    if (found) {
      found.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);

  const handleViewForm = async (leaveId) => {
    try {
      const res = await fetch(`/api/leaves/viewform/${leaveId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error fetching details');
      setFormDetails(data);
      setShowModal(true);
    } catch (err) {
      alert('Failed to fetch form details');
      console.error(err);
    }
  };

  const filteredLeaves = rejectedLeaves.filter(leave => {
    const matchesSearch = !searchTerm ||
      leave.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = !filterDepartment ||
      leave.department?.toLowerCase() === filterDepartment.toLowerCase();

    const matchesLeaveType = !filterLeaveType ||
      (leave.leavetype || leave.leaveType)?.toLowerCase() === filterLeaveType.toLowerCase();

    return matchesSearch && matchesDepartment && matchesLeaveType;
  });

  // Get unique departments and leave types for filter dropdowns
  const uniqueDepartments = [...new Set(rejectedLeaves.map(leave => leave.department).filter(Boolean))];
  const uniqueLeaveTypes = [...new Set(rejectedLeaves.map(leave => leave.leavetype || leave.leaveType).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDepartment('');
    setFilterLeaveType('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-700">Rejected Leave Applications</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <>
            {/* Pie Chart */}
            <div className="w-full h-80 mx-auto max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-center text-red-700">Rejected Leaves by Type</h2>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, or department..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Department Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                {/* Leave Type Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={filterLeaveType}
                  onChange={(e) => setFilterLeaveType(e.target.value)}
                >
                  <option value="">All Leave Types</option>
                  {uniqueLeaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                {/* Clear Filters Button */}
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>

              {/* Results Count */}
              <div className="mt-3 text-sm text-gray-600">
                Showing {filteredLeaves.length} of {rejectedLeaves.length} rejected applications
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mb-8">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-red-100 text-red-800 uppercase text-sm font-bold">
                    <th className="px-4 py-3 border">Name</th>
                    <th className="px-4 py-3 border">Department</th>
                    <th className="px-4 py-3 border">Leave Type</th>
                    <th className="px-4 py-3 border">Applicant Role</th>
                    <th className="px-4 py-3 border">From</th>
                    <th className="px-4 py-3 border">To</th>
                    <th className="px-4 py-3 border">Assignment Days</th>
                    <th className="px-4 py-3 border">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave) => (
                    <tr key={leave._id} className="text-center hover:bg-red-50">
                      <td className="px-4 py-2 border">{leave.name}</td>
                      <td className="px-4 py-2 border">{leave.department}</td>
                      <td className="px-4 py-2 border">{leave.leavetype}</td>
                      <td className="px-4 py-2 border"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs capitalize">
                        {leave.applicantRole || 'N/A'}
                      </span></td>
                      <td className="px-4 py-2 border">{new Date(leave.fromDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">{new Date(leave.toDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">{leave.assignmentDays}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleViewForm(leave._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                        >
                          View Form
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Modal for Viewing Form */}
        {showModal && formDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-4 text-center">Leave Form Details</h2>
              <div className="space-y-3 text-sm">
                <p><strong>Name:</strong> {formDetails.name}</p>
                <p><strong>Email:</strong> {formDetails.email}</p>
                <p><strong>Department:</strong> {formDetails.department}</p>
                <p><strong>Leave Type:</strong> {formDetails.leavetype || formDetails.leaveType}</p>
                <p><strong>From:</strong> {new Date(formDetails.fromDate).toLocaleDateString()}</p>
                <p><strong>To:</strong> {new Date(formDetails.toDate).toLocaleDateString()}</p>
                <p><strong>Days:</strong> {formDetails.assignmentDays || formDetails.days}</p>
                <p><strong>Reason:</strong> {formDetails.reason || 'N/A'}</p>
                <p><strong>Status:</strong>
                  <span className="ml-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                    {formDetails.status}
                  </span>
                </p>
                {formDetails.remarks && formDetails.remarks.length > 0 && (
                  <div className="mt-2">
                    <strong>Remarks:</strong>
                    <ul className="list-disc ml-6">
                      {formDetails.remarks.map((r, idx) => (
                        <li key={idx}><span className="font-semibold">{r.by}:</span> {r.text} <span className="text-xs text-gray-500">({new Date(r.date).toLocaleString()})</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="text-center mt-6">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}