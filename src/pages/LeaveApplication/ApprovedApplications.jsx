import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaSearch } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#FF7F50'];

export default function ApprovedApplications() {
    const [approvedLeaves, setApprovedLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formDetails, setFormDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterLeaveType, setFilterLeaveType] = useState('');

    useEffect(() => {
        // Get user info from localStorage, session, or context
        // You'll need to replace this with your actual auth method
        const getCurrentUser = () => {
            // Example: assuming you store user info in localStorage after login
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return {
                role: user.role || '',
                email: user.email || ''
            };
        };

        const { role, email } = getCurrentUser();
        setUserRole(role);
        setUserEmail(email);

        const fetchApproved = async () => {
            try {
                // Use the role-based endpoint you already have
                const res = await fetch(`/api/leaves/by-role?role=${role}&email=${email}`);
                const allLeaves = await res.json();

                // Filter only approved leaves
                const approved = allLeaves.filter(leave => leave.status === 'Approved');
                setApprovedLeaves(approved);
            } catch (err) {
                console.error('Error fetching approved leaves:', err);
            } finally {
                setLoading(false);
            }
        };

        if (role && email) {
            fetchApproved();
        } else {
            setLoading(false);
        }
    }, []);

    const chartData = approvedLeaves.reduce((acc, leave) => {
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

    const getRoleDisplayName = (role) => {
        const roleNames = {
            'hod': 'Head of Department',
            'dean': 'Dean',
            'deputyDirector': 'Deputy Director',
            'director': 'Director'
        };
        return roleNames[role] || role;
    };

    const getVisibleApplicationsText = () => {
        switch (userRole) {
            case 'hod':
                return 'Faculty Applications';
            case 'dean':
                return 'Faculty & HOD Applications';
            case 'deputyDirector':
                return 'Dean & HOD Applications';
            case 'director':
                return 'All Applications (Faculty, HOD & Dean)';
            default:
                return 'Applications';
        }
    };

    // Filter functions
    const filteredLeaves = approvedLeaves.filter(leave => {
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
    const uniqueDepartments = [...new Set(approvedLeaves.map(leave => leave.department).filter(Boolean))];
    const uniqueLeaveTypes = [...new Set(approvedLeaves.map(leave => leave.leavetype || leave.leaveType).filter(Boolean))];

    const clearFilters = () => {
        setSearchTerm('');
        setFilterDepartment('');
        setFilterLeaveType('');
    };

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-center text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!userRole) {
        return (
            <div className="p-6">
                <div className="text-center text-red-600">
                    <p>Unable to determine user role. Please log in again.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header/>
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-center mb-2 text-green-700">
                    Approved Leave Applications
                </h1>
                <p className="text-center text-gray-600">
                    Viewing as: <span className="font-semibold">{getRoleDisplayName(userRole)}</span> |
                    Showing: <span className="font-semibold">{getVisibleApplicationsText()}</span>
                </p>
            </div>

            {approvedLeaves.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No approved leave applications found.</p>
                </div>
            ) : (
                <>
                    {/* Pie Chart */}
                    <div className="w-full h-90 mx-auto max-w-md">
                      <h2 className="text-xl font-semibold mb-4 text-center text-green-700">Approved Leaves by Type</h2>
                      <ResponsiveContainer width="100%" height="80%">
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
                    {/* Search and Filter Section */}
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
                            Showing {filteredLeaves.length} of {approvedLeaves.length} approved applications
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-green-100 text-green-800 uppercase text-sm font-bold">
                                    <th className="px-4 py-3 border">Name</th>
                                    <th className="px-4 py-3 border">Department</th>
                                    <th className="px-4 py-3 border">Applicant Role</th>
                                    <th className="px-4 py-3 border">Leave Type</th>
                                    <th className="px-4 py-3 border">From</th>
                                    <th className="px-4 py-3 border">To</th>
                                    <th className="px-4 py-3 border">Days</th>
                                    <th className="px-4 py-3 border">Approved By</th>
                                    <th className="px-4 py-3 border">Status</th>
                                    <th className="px-4 py-3 border">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave) => (
                                    <tr key={leave._id} className="text-center hover:bg-green-50">
                                        <td className="px-4 py-2 border">{leave.name}</td>
                                        <td className="px-4 py-2 border">{leave.department}</td>
                                        <td className="px-4 py-2 border">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs capitalize">
                                                {leave.applicantRole || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border">{leave.leavetype || leave.leaveType}</td>
                                        <td className="px-4 py-2 border">
                                            {new Date(leave.fromDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {new Date(leave.toDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {leave.assignmentDays || leave.days || 'N/A'}
                                        </td>
                                        <td className="px-4 py-2 border">{leave.approvedBy || 'N/A'}</td>
                                        <td className="px-4 py-2 border">
                                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                                                Approved
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <button
                                                onClick={() => handleViewForm(leave._id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors"
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

            {/* Enhanced Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Total Approved</h3>
                    <p className="text-2xl font-bold text-green-900">{approvedLeaves.length}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Departments</h3>
                    <p className="text-2xl font-bold text-blue-900">{uniqueDepartments.length}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Leave Types</h3>
                    <p className="text-2xl font-bold text-purple-900">{uniqueLeaveTypes.length}</p>
                </div>
            </div>

            {/* Modal for Viewing Form */}
            {showModal && formDetails && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
                            Leave Form Details
                        </h2>
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
                            <p><strong>Approved By:</strong> {formDetails.approvedBy || 'N/A'}</p>
                            {formDetails.remarks && (
                                <p><strong>Remarks:</strong> {formDetails.remarks}</p>
                            )}
                        </div>
                        <div className="text-center mt-6">
                            <button
                                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Footer/>
        </div>
    );
}