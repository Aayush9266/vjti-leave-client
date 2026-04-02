import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { registerUser } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext.jsx';
import toast from 'react-hot-toast';

const roles = ['admin', 'dean', 'hod', 'faculty', 'clerk','staff','contractual faculty', 'deputy director', 'director'];
const departments = [
  'Computer',
  'IT',
  'EXTC',
  'Electrical',
  'Mechanical',
  'Civil',
  'Textile',
  'Production',
  'Structural',
  'Other',
];

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    department: '',
    position: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      const role = user.role;
      console.log(user);
      // Navigate based on user role
      if (role === 'faculty'||role === 'clerk'||role === 'staff'||role === 'contractual faculty') {
        navigate('/faculty');
      } else if(role === 'admin') {
        navigate('/Admindash');
      } else {
        navigate('/Hoddash');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await registerUser(form);
      console.log('Signup raw response:', data);

      login(data);
      localStorage.setItem('token', data.token || (data.user?.token) || (data.data?.token));
      toast.success('Signup successful!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Header />

      <main className="flex-grow flex justify-center items-center py-10 px-4">
        <Card className="w-full max-w-2xl overflow-hidden shadow-lg rounded-2xl border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              शैक्षणिक सूचना प्रणाली
            </h2>
            <h3 className="text-lg text-gray-600">
              Academic Information System
            </h3>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#640D14] focus:border-[#640D14]"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#640D14] focus:border-[#640D14]"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#640D14] focus:border-[#640D14]"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </Label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#640D14] focus:border-[#640D14]"
                required
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
              <Label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </Label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#640D14] focus:border-[#640D14]"
                required
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
              <Label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position (optional)
              </Label>
              <Input
                id="position"
                name="position"
                type="text"
                placeholder="Enter your position (optional)"
                value={form.position}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#640D14] focus:border-[#640D14]"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <Button
                className="w-full bg-[#640D14] hover:bg-[#800E13] text-white py-2 px-4 rounded-md transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
