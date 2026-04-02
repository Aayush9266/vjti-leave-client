import FacultyAPI from '../../services/facultyAPI';
import { STATUS_COLORS } from '../../utils/constants';
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import vjtilogo from "@/assets/vjtilogo.png";

const MyApplicationsTable = ({ onPendingCount }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await FacultyAPI.getMyApplications();
      const apps = response?.success && Array.isArray(response.data) ? response.data : [];
      setApplications(apps);
      const count = apps.filter((app) => (app.status === "Pending" || app.status === "PENDING")).length;
      onPendingCount(count);
      setError(response?.success ? null : (response?.message || 'Failed to load applications'));
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format remarks - handles both array and string formats
  const formatRemarks = (remarks) => {
    if (!remarks) return '-';
    
    // If it's already a string, just return it
    if (typeof remarks === 'string') {
      return remarks.trim() || '-';
    }
    
    // If it's an array (legacy format), convert to string
    if (Array.isArray(remarks) && remarks.length > 0) {
      return remarks.map(remark => {
        if (typeof remark === 'string') {
          return remark;
        } else if (remark && remark.text) {
          return remark.text;
        }
        return '';
      }).filter(text => text.trim()).join('; ') || '-';
    }
    
    return '-';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">MY APPLICATIONS</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadApplications}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const downloadPDF = (jsonData) => {
    const doc = new jsPDF();

    doc.addImage(vjtilogo, 'PNG', 10, 10, 150, 50); // top-right logo
    // Header
    doc.setFontSize(18);
    doc.text('Leave Application Report', 14, 70);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 80);

    let y = 90; // initial y position

    jsonData.forEach((user, index) => {
      doc.setFontSize(12);
      doc.text(`Application #${index + 1}`, 14, y);
      y += 6;

      // Dynamically print all fields
      Object.entries(user).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 14, y);
        y += 6;
      });

      // Divider line
      doc.line(14, y, 196, y);
      y += 10;

      // Add new page if needed
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('leave-report.pdf');
  };


  return (
    <div className="bg-[#9d2235] rounded-lg shadow-md mt-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-100">MY APPLICATIONS</h2>
      </div>

      {applications.length === 0 ? (
        <div className="p-6 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">No leave applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Print</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.leavetype}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(application.toDate).toLocaleDateString()} - {new Date(application.fromDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.assignmentDays}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(application.appliedDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[application.status]}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.approvedBy || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={formatRemarks(application.remarks)}>
                      {formatRemarks(application.remarks)}
                    </div>
                  </td>
                  <td>
                    <button onClick={() => downloadPDF([application])}>Download PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsTable;