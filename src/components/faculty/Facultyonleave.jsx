import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '../Dash_hod/sidebar';
import axios from 'axios';
import { useAuth } from '@/contexts/authContext.jsx';

export default function UsersPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8089/api/leaves/active-leaves-count')
    .then(res => {
      if (user.role === 'hod') {
        const filteredData = res.data.filter(entry => entry.department === user.department);
        setUsers(filteredData);
        // console.log(filteredData);
      } else {
        setUsers(res.data);
        // console.log(res.data);
      }
    })
    .catch(err => console.error('Error fetching active leaves:', err));
    // setUsers(mockUsers);
  }, [user]);

  useEffect(() => {
    let tempUsers = [...users];

    if (selectedDepartment !== 'All') {
      tempUsers = tempUsers.filter((u) => u.department === selectedDepartment);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      tempUsers = tempUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.department.toLowerCase().includes(query) ||
          u.leavetype.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(tempUsers);
  }, [users, searchTerm, selectedDepartment]);

  const departments = ['All', ...new Set(users.map((u) => u.department))];

  return (
    <div>
        <Header/>
        <div className='display flex'>
            <Sidebar/>
            <div className="max-w-4xl mx-auto p-6">
              <h1 className="text-3xl font-bold mb-6 text-center">Leave Applications</h1>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <input
                  type="text"
                  placeholder="Search by name, department, or leave type"
                  className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="w-full sm:w-56 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Cards (Vertical List) */}
              <div className="flex flex-col gap-4">
                {filteredUsers.length === 0 ? (
                  <p className="text-gray-500 text-center">No users found.</p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex justify-between flex-col md:flex-row md:items-start md:w-[48rem]">
                        <div className="text-gray-600 space-y-1">
                          <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.name}</h2>
                          <p>
                            <span className="font-medium">Department:</span> {user.department}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {user.email}
                          </p>
                        </div>
                        <div className="text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Leave Type:</span> {user.leavetype}
                          </p>
                          <p>
                            <span className="font-medium">From:</span> {user.fromDate}
                          </p>
                          <p>
                            <span className="font-medium">To:</span> {user.toDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>
        <Footer/>
    </div>
  );
}
