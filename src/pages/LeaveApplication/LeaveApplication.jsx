import React, { useState } from 'react';
import { Calendar, User, Building, Phone, Mail, FileText, Clock, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/authContext.jsx';
import { useNavigate } from 'react-router-dom';
export default function LeaveApplication() {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        department: '',
        name: '',
        designation: '',
        assigningInstitute: '',
        assigningType: '',
        visitingInstitute: '',
        // assignmentDate: '',
        fromDate: '',
        toDate: '',
        assignmentDays: '',
        assignmentPlace: '',
        contactNo: '',
        address: '',
        salientFeatures: '',
        natureOfAssignment: [],
        scheduleDetails: [{ sr: 1, details: '', arrangements: '' }],
        slDlTaken: '',
        applicationDate: '',
        // facultyRecommendation: '',
        // hodApproval: '',
        // deanApproval: ''
    });

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newFormData = {
                ...prev,
                [name]: value
            };

            // Auto-calculate days when from/to dates change
            if (name === 'fromDate' || name === 'toDate') {
                if (newFormData.fromDate && newFormData.toDate) {
                    const fromDate = new Date(newFormData.fromDate);
                    const toDate = new Date(newFormData.toDate);
                    const timeDiff = toDate.getTime() - fromDate.getTime();
                    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
                    newFormData.assignmentDays = daysDiff > 0 ? daysDiff.toString() : '';
                }
            }

            return newFormData;
        });
    };

    const handleCheckboxChange = (value) => {
        setFormData(prev => ({
            ...prev,
            natureOfAssignment: prev.natureOfAssignment.includes(value)
                ? prev.natureOfAssignment.filter(item => item !== value)
                : [...prev.natureOfAssignment, value]
        }));
        console.log(formData.natureOfAssignment);
    };

    const addScheduleRow = () => {
        setFormData(prev => ({
            ...prev,
            scheduleDetails: [...prev.scheduleDetails, { sr: prev.scheduleDetails.length + 1, details: '', arrangements: '' }]
        }));
    };

    const updateScheduleRow = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            scheduleDetails: prev.scheduleDetails.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        }));
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log('Form submitted:', formData);
    //     alert('Application submitted successfully!');
    // };
     const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
        // console.log(localStorage.user.email);
      const userJSON = localStorage.getItem('user');
      const user = JSON.parse(userJSON);
      const email = user.email;
      // Convert array of strings into nature object
      const nature = {};
      formData.natureOfAssignment.forEach(item => {
        const [typeRaw, value] = item.split('-');
        const type = typeRaw.toLowerCase(); // Convert "Committee" -> "committee", etc.
        nature[type] = value;
      });
      // Prepare the payload based on formData structure
      const payload = {
        facultyId: user.id,
        leavetype: 'Special Leave',
        department: user.department,
        name: user.name,
        email: email,
        fromDate: formData.fromDate,
        toDate: formData.toDate, // If needed, you can add separate to_date
        assignmentDays: parseInt(formData.assignmentDays),
        // status: 'pending', // optional; default in schema
        details: {
          designation: formData.designation,
          assigningInstitute: formData.assigningInstitute,
          assigningType: formData.assigningType,
          visitingInstitute: formData.visitingInstitute,
          assignmentPlace: formData.assignmentPlace,
          address: formData.address,
          contactNo: parseInt(formData.contactNo),
          salientFeatures: formData.salientFeatures
        },
        // nature: {
        //   // Assuming `natureOfAssignment` is an array like:
        //   // ['commitee:selection', 'conference:presentation', ...]
        //   commitee: '',
        //   conference: '',
        //   project: '',
        //   visit: '',
        //   examination: ''
        // },
        nature: nature, // Transformed object
        scheduleDetails: formData.scheduleDetails[0], // If you're storing a single item in array
        slDlTaken: parseInt(formData.slDlTaken),
        // approval: {
        //   recomendation: formData.facultyRecommendation,
        //   hod: formData.hodApproval,
        //   dean: formData.deanApproval
        // },
        
      };

      // Map natureOfAssignment array into nature object
      formData.natureOfAssignment.forEach(item => {
        const [key, value] = item.split(':'); // e.g., 'commitee:selection'
        payload.nature[key] = value;
      });

      try {
        const response = await fetch('http://localhost:8089/api/form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        console.log(response);
        if (!response.ok) {
          throw new Error('Form submission failed');
        }

        const data = await response.json();
        console.log('Form submitted:', data);
        if(user.role === 'faculty'){
          navigate('/faculty');
        }
        else{
          navigate('/HodDash');
        }
        // Optionally reset form or show success message
      } catch (error) {
        console.error('Submission error:', error.message);
      }
    };

    return (
        <div className="relative min-h-screen bg-white flex flex-col">
            <Header />
            <div className="py-8 px-4">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-red-800 text-white p-6">
                        <div className="text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                                <h1 className="text-xl font-semibold flex items-center justify-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Application Form for Special Leave (SL) / Duty Leave (DL)
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name & Faculty</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={user.name}
                                        readOnly
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your designation"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Date</label>
                                    <input
                                        type="date"
                                        name="applicationDate"
                                        value={formData.applicationDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Assignment Details */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <Building className="w-5 h-5 text-blue-600" />
                                Details of the Assignment
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name of Assigning Institute/Organization/Industry</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="assigningInstitute"
                                                value={formData.assigningInstitute}
                                                onChange={handleInputChange}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Enter institute/organization name"
                                            />
                                            <select
                                                name="assigningType"
                                                value={formData.assigningType}
                                                onChange={handleInputChange}
                                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Type</option>
                                                <option value="Govt">Govt.</option>
                                                <option value="Pvt">Pvt.</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name of Visiting Institute/Organization/Industry</label>
                                        <input
                                            type="text"
                                            name="visitingInstitute"
                                            value={formData.visitingInstitute}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter visiting institute name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                        <input
                                            type="date"
                                            name="fromDate"
                                            value={formData.fromDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                        <input
                                            type="date"
                                            name="toDate"
                                            value={formData.toDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">No. of Days</label>
                                        <input
                                            type="number"
                                            name="assignmentDays"
                                            value={formData.assignmentDays}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                                            placeholder="Auto-calculated"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Place</label>
                                        <input
                                            type="text"
                                            name="assignmentPlace"
                                            value={formData.assignmentPlace}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter place"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Contact No.
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactNo"
                                            value={formData.contactNo}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter contact number"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Address for Contact
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter contact address"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Salient Features of the Assignment</label>
                                    <textarea
                                        name="salientFeatures"
                                        value={formData.salientFeatures}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Describe the key features and objectives of your assignment"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Nature of Assignment */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Nature of the Assignment</h3>
                            <div className="space-y-6">
                                {/* Committee */}
                                <div>
                                    <h4 className="text-md font-semibold text-gray-700 mb-3">Committee</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                        {['Selection', 'Advisory', 'Screening', 'Expert', 'Other'].map((option) => (
                                            <label key={`committee-${option}`} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.natureOfAssignment.includes(`Committee-${option}`)}
                                                    onChange={() => handleCheckboxChange(`Committee-${option}`)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Conference */}
                                <div>
                                    <h4 className="text-md font-semibold text-gray-700 mb-3">Conference</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {['Presentation', 'Keynote Address', 'Session Chairman', 'Other'].map((option) => (
                                            <label key={`conference-${option}`} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.natureOfAssignment.includes(`Conference-${option}`)}
                                                    onChange={() => handleCheckboxChange(`Conference-${option}`)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Project */}
                                <div>
                                    <h4 className="text-md font-semibold text-gray-700 mb-3">Project</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {['Sponsored', 'Consultancy', 'Technology Mission', 'Other'].map((option) => (
                                            <label key={`project-${option}`} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.natureOfAssignment.includes(`Project-${option}`)}
                                                    onChange={() => handleCheckboxChange(`Project-${option}`)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Visit */}
                                <div>
                                    <h4 className="text-md font-semibold text-gray-700 mb-3">Visit</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                        {['Industry', 'University/DTE', 'Institute', 'NBA/AICTE', 'Other'].map((option) => (
                                            <label key={`visit-${option}`} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.natureOfAssignment.includes(`Visit-${option}`)}
                                                    onChange={() => handleCheckboxChange(`Visit-${option}`)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Examination */}
                                <div>
                                    <h4 className="text-md font-semibold text-gray-700 mb-3">Examination</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {['Viva_Voce Ph.D/M.Tech/M.S/B.Tech', 'Other'].map((option) => (
                                            <label key={`examination-${option}`} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.natureOfAssignment.includes(`Examination-${option}`)}
                                                    onChange={() => handleCheckboxChange(`Examination-${option}`)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Details */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Schedule on Leave Days
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="text-left p-3 font-medium text-gray-700">Sr.</th>
                                            <th className="text-left p-3 font-medium text-gray-700">Scheduled academic, administrative and other duties on leave days</th>
                                            <th className="text-left p-3 font-medium text-gray-700">Alternate necessary arrangements made</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.scheduleDetails.map((row, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-600">{row.sr}</td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        value={row.details}
                                                        onChange={(e) => updateScheduleRow(index, 'details', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter scheduled duties"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        value={row.arrangements}
                                                        onChange={(e) => updateScheduleRow(index, 'arrangements', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter alternate arrangements"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={addScheduleRow}
                                    className="mt-4 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Row
                                </button>
                            </div>
                        </div>

                        {/* Leave Information */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Leave Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">I have taken __ no of SL/DLs in this calendar year (Maximum 30 days)</label>
                                    <input
                                        type="number"
                                        name="slDlTaken"
                                        value={formData.slDlTaken}
                                        onChange={handleInputChange}
                                        max="30"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter number of days taken"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Approvals
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Approvals & Recommendations
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Faculty Recommendation</label>
                                <select
                                    name="facultyRecommendation"
                                    value={formData.facultyRecommendation}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Recommendation</option>
                                    <option value="recommended">Recommended for approval</option>
                                    <option value="not-recommended">Not Recommended</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Head of the Department</label>
                                <select
                                    name="hodApproval"
                                    value={formData.hodApproval}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Status</option>
                                    <option value="approved">Approved</option>
                                    <option value="not-approved">Not Approved</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dean Administration</label>
                                <select
                                    name="deanApproval"
                                    value={formData.deanApproval}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Status</option>
                                    <option value="approved">Approved</option>
                                    <option value="not-approved">Not Approved</option>
                                </select>
                            </div>
                        </div>
                    </div> */}

                        {/* Submit Button */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-8 py-4 bg-red-800 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Submit Application
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}