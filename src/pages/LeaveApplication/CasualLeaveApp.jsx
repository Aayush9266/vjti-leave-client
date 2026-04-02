import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/authContext.jsx';
import { useNavigate } from 'react-router-dom';

const VJTICasualLeaveForm = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    leaveDate: '',
    dayType: '',
    status: 'pending', // kept in schema but not shown in form
    reason: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {

    e.preventDefault();
    const userJSON = localStorage.getItem('user');
    const user = JSON.parse(userJSON);
    const email = user.email;

    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    // Prepare data for backend
    const submitData = {
      facultyId: user.id,
      name: user.name,
      email: email,
      designation: formData.designation,
      department: user.department,
      fromDate: formData.leaveDate,
      toDate: formData.leaveDate,
      assignmentDays: formData.dayType,
      leavetype: 'Casual Leave',
      status: 'Pending',
      reason: formData.reason
    };

    try {
      const response = await fetch('http://localhost:8089/api/form/casual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      const data = await response.json();
      console.log('Casual leave submitted:', data);
      alert('Casual leave submitted successfully!');
      if(user.role === 'faculty'){
        navigate('/faculty');
      }
      else{
        navigate('/HodDash');
      }
    } catch (error) {
      console.error('Submission error:', error.message);
    }


  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto h-screen">
        {/* Header - Maroon Section */}
        <div className="bg-red-800 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-4">
            {/* VJTI Logo placeholder */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">VJTI</span>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold mb-1">VEERMATA JIJABAI TECHNOLOGICAL INSTITUTE</h1>
              <p className="text-base font-semibold">MATUNGA, MUMBAI - 400 019.</p>
            </div>
          </div>
        </div>

        {/* Form Content - White Section */}
        <div>
          <Card className="rounded-t-none shadow-lg">
            <CardContent className="p-6">
              {/* Form Title */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-2">CASUAL LEAVE APPLICATION</h3>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-medium">Department / Section</span>
                  <span className="font-medium">Year: 2025</span>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={user.name}
                    readOnly
                    className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none px-0 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-sm font-medium">
                    Designation
                  </Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none px-0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department
                  </Label>
                  <Input
                    id="department"
                    value={user.department}
                    readOnly
                    className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none px-0 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaveType" className="text-sm font-medium">
                    Leave Type
                  </Label>
                  <Input
                    id="leaveType"
                    value="Casual Leave"
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaveDate" className="text-sm font-medium">
                    Leave Date
                  </Label>
                  <Input
                    id="leaveDate"
                    type="date"
                    value={formData.leaveDate}
                    onChange={(e) => handleInputChange('leaveDate', e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dayType" className="text-sm font-medium">
                    Day Type
                  </Label>
                  <Select value={formData.dayType} onValueChange={(value) => handleInputChange('dayType', value)} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Day Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Full Day</SelectItem>
                      <SelectItem value="0.5">Half Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-medium">
                    Reason
                  </Label>
                  <textarea 
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none px-0 w-full h-[5rem]"
                    
                  />
                </div>
              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleSubmit}
                  className="bg-red-800 hover:bg-red-700 text-white px-8 py-2 rounded-lg font-medium"
                >
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VJTICasualLeaveForm;