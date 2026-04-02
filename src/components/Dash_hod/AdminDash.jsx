import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar'
import ApprovalWidgets from '../faculty/Approvalwidgets';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeaveHeader from '../faculty/LeaveHeader';
import { getAllUsers, createUser, updateUser, deleteUser, resetLeaveBalances  } from '../../services/adminAPI';
import { Input } from '../ui/input'; // Replace with your own Input/Label/Button components
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { registerUser } from '@/services/authService';

const roles = ['admin', 'dean', 'hod', 'faculty', 'clerk', 'student', 'deputy director', 'director'];
const departments = ['Computer', 'IT', 'Mechanical', 'Electrical', 'Civil'];

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null); // user object to edit
    const [form, setForm] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);


    useEffect(() => {
      getAllUsers()
        .then(setUsers)
        .catch(console.error);
    }, []);

    const openEditModal = (user) => {
        setForm(user);
        setEditUser(user);
        setIsEditMode(true);
        setError('');
      };

      const closeEditModal = () => {
        setEditUser(null);
        setForm({});
        setError('');
      };

      const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };

    const openAddModal = () => {
      setForm({
        name: '',
        email: '',
        password: '',
        role: '',
        department: '',
        position: ''
        // Include password if needed
      });
      setIsEditMode(false);
      setEditUser({}); // or any non-null value to show the modal
      setError('');
    };


    const handleCreate = async () => {
      try {
        const newUser = await createUser({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'john123',
          role: 'faculty',
          department: 'IT'
        });
        setUsers(prev => [...prev, newUser.user]);
      } catch (err) {
        console.error(err);
      }
    };

    // const handleUpdate = async (id) => {
    //   try {
    //     const updated = await updateUser(id, { name: 'Updated Name' });
    //     setUsers(prev => prev.map(user => user._id === id ? updated.user : user));
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        if (isEditMode) {
          // Update existing user
          const { _id, ...updatedFields } = form;
          const result = await updateUser(_id, updatedFields);
          setUsers((prev) =>
            prev.map((user) => (user._id === _id ? result.user : user))
          );
        } else {
          // Add new user
          const result = await registerUser(form); // You'll define this API below
          setUsers((prev) => [...prev, result.user]);
        }
        closeEditModal();
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };


    const handleDelete = async (id) => {
      try {
        await deleteUser(id);
        setUsers(prev => prev.filter(user => user._id !== id));
      } catch (err) {
        console.error(err);
      }
    };

    const handleReset = async () => {
      const confirmReset = window.confirm("Are you sure you want to reset all leave balances?");
      if (!confirmReset) return;
    
      try {
        setStatus('Resetting...');
        const result = await resetLeaveBalances();
        setStatus(`✅ ${result.message}`);
      } catch (err) {
        setStatus(`❌ ${err.message}`);
      }
    };

    return (
      <div>
        <Header/>
        <div className="admin-dashboard" style={{ display: 'flex' }}>
          <div><Sidebar /></div>
          <div className='mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <LeaveHeader/>
            <ApprovalWidgets/>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center',     // Optional: center vertically (if height set)
                height: '100px'           // Optional: give some height to see vertical centering
              }}
            >
              <button
                onClick={handleReset}
                style={{
                  padding: '12px 32px',        // More padding
                  minWidth: '200px',           // Make it wider
                  background: '#800E13',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Reset Leave Balance
              </button>
              <button
                onClick={openAddModal}
                style={{
                  margin: '0px 0px 0px 10px ',
                  padding: '12px 32px',        // More padding
                  minWidth: '200px',           // Make it wider
                  background: '#800E13',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Add User
              </button>
            </div>
            <div className="border border-gray-300 rounded overflow-hidden mt-6">
              <div className="overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="min-w-full bg-white border border-gray-200 shadow">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase">
                        <th className="px-6 py-3 border">Name</th>
                        <th className="px-6 py-3 border">Email</th>
                        <th className="px-6 py-3 border">Role</th>
                        <th className="px-6 py-3 border">Department</th>
                        <th className="px-6 py-3 border">Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50 text-sm">
                            <td className="px-6 py-3 border">{user.name}</td>
                            <td className="px-6 py-3 border">{user.email}</td>
                            <td className="px-6 py-3 border capitalize">{user.role}</td>
                            <td className="px-6 py-3 border">{user.department}</td>
                            <td className="px-4 py-2 border">
                              <button
                                onClick={() => openEditModal(user)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Modal */}
                {editUser && (
                  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white w-full max-w-lg rounded-md shadow-lg p-6 relative">
                      <h3 className="text-lg font-semibold mb-4">
                        {isEditMode ? 'Edit User' : 'Add New User'}
                      </h3>
                      <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name || ''}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email || ''}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        {!isEditMode && (
                          <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={form.password || ''}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <select
                            id="role"
                            name="role"
                            value={form.role || ''}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select role</option>
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <select
                            id="department"
                            name="department"
                            value={form.department || ''}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select department</option>
                            {departments.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="position">Position (optional)</Label>
                          <Input
                            id="position"
                            name="position"
                            type="text"
                            value={form.position || ''}
                            onChange={handleChange}
                          />
                        </div>
                        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                        <div className="flex justify-between mt-6">
                          <Button
                            type="button"
                            onClick={closeEditModal}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-[#640D14] text-white px-4 py-2 rounded hover:bg-[#800E13]"
                            disabled={loading}
                          >
                            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Create')}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
}
