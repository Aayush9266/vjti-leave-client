import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacultyAPI from '../../services/facultyAPI';
import { LEAVE_TYPES, DEPARTMENTS } from '../../utils/constants';
import { useAuth } from '@/contexts/authContext.jsx';

const LeaveApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    subDepartment: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [calculatedDays, setCalculatedDays] = useState(0);
  const { user, logout } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        department: value,
        subDepartment: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (name === 'startDate' || name === 'endDate') {
      const startDate = name === 'startDate' ? value : formData.startDate;
      const endDate = name === 'endDate' ? value : formData.endDate;

      if (startDate && endDate) {
        const days = FacultyAPI.calculateLeaveDays(startDate, endDate);
        setCalculatedDays(days);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const leaveData = {
        ...formData,
        days: calculatedDays
      };
      
      const customData = {
        department: user.department,
        leavetype: formData.leaveType,
        fromDate: formData.startDate,
        toDate: formData.endDate,
        assignmentDays: calculatedDays,
        reason: formData.reason,
        contact: formData.contact,
        
      };

      const response = await FacultyAPI.applyLeave(customData);

      if (response.success) {
        setSuccess(response.message);
        setFormData({
          department: '',
          subDepartment: '',
          leaveType: '',
          startDate: '',
          endDate: '',
          reason: '',
          contact: ''
        });
        setCalculatedDays(0);
        setTimeout(() => {
          if (user.role === 'faculty') {
            navigate('/faculty');
          } else {
            navigate('/HodDash');
          }
        }, 2000);

      }
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if(user.role === 'faculty'){
      navigate('/faculty');
    }
    else{
      navigate('/HodDash');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
        <h2 className="text-2xl font-semibold text-gray-800">Apply for Leave</h2>
        <p className="text-sm text-gray-600 mt-1">Fill in the details to submit your leave application</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Department */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                  type="text"
                  name="department"
                  value={user.department}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your department"
              />
          </div>

          {/* Leave Type */}
          <div>
            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type *
            </label>
            <select
              id="leaveType"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select Leave Type</option>
              {Object.entries(LEAVE_TYPES).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Number of Leave Days */}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-800 font-medium mt-1">
              Number of Leave Days: {calculatedDays}
            </p>
          </div>

          {/* Reason */}
          <div className="md:col-span-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason *
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
              Contact
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="e.g., John from IT or 9876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Submit + Cancel */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveApplicationForm;