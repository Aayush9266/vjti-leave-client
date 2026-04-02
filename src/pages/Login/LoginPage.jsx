import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import vjtiBuilding from '@/assets/vjti-building.jpg';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
// Import requestPasswordReset along with loginUser
import { loginUser, requestPasswordReset } from '@/services/authService';
import { useAuth } from '@/contexts/authContext.jsx';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleFormToggle = () => {
    setIsResetMode(!isResetMode);
    setEmail(''); // Optionally clear email, or keep it if user might toggle back
    setPassword(''); // Clear password when toggling
    setError('');
  };

  useEffect(() => {
    if (user) {
      const role = user.role;
      console.log(user);
      console.log(role);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isResetMode) {
      // Handle Password Reset
      try {
        // Ensure requestPasswordReset is implemented in '@/services/authService'
        // It should take the email and make an API call.
        const response = await requestPasswordReset(email);
        toast.success(response?.message || 'Password reset instructions sent. Please check your email.');
        // Navigate to the OTP verification page, passing email in state
        // The route '/verify-otp' should match your route configuration for VerifyOtpPage.jsx
        navigate('/verify-otp', { state: { email: email } });
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset instructions. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle Login
      try {
        const data = await loginUser(email, password);
        console.log('Login raw response:', data);

        login(data);
        localStorage.setItem('token', data.token || (data.user?.token) || (data.data?.token));
        toast.success('Logged in successfully!');
        // Navigation to '/default' is handled by the useEffect hook
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col justify-between">
      <Link to="/signup">
        <Button className="absolute bottom-1/4 right-5 rounded-full">
          Signup
        </Button>
      </Link>

      <Header />

      <main className="flex-grow flex justify-center items-center py-10 px-4">
        <Card className="w-full max-w-5xl flex flex-col md:flex-row overflow-hidden shadow-lg rounded-2xl border border-gray-200 p-0">
          <div className="flex-1 p-8 bg-white flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                शैक्षणिक सूचना प्रणाली
              </h2>
              <h3 className="text-lg text-gray-600">
                Academic Information System
              </h3>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="transform transition-all duration-300 ease-in-out">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#640D14] focus:border-[#640D14]"
                  required
                />
              </div>

              <div
                className={`transform transition-all duration-500 ease-in-out ${
                  isResetMode
                    ? 'opacity-0 max-h-0 overflow-hidden scale-y-0'
                    : 'opacity-100 max-h-32 scale-y-100'
                }`}
              >
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#640D14] focus:border-[#640D14]"
                  required={!isResetMode} // Password is not required in reset mode
                />
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={handleFormToggle}
                    className="text-sm text-[#800E13] hover:underline transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div
                className={`transform transition-all duration-500 ease-in-out ${
                  isResetMode
                    ? 'opacity-100 max-h-20 scale-y-100 translate-y-0'
                    : 'opacity-0 max-h-0 scale-y-0 -translate-y-4 overflow-hidden'
                }`}
              >
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
                  Enter your email address and we will send you an OTP to reset your password.
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <div className="transform transition-all duration-300 ease-in-out">
                <Button
                  type="submit" // Explicitly set type to submit
                  className="w-full bg-[#640D14] hover:bg-[#800E13] text-white py-2 px-4 rounded-md transition-all duration-200"
                  disabled={loading}
                >
                  <span className="transition-all duration-300">
                    {/* Updated loading text */}
                    {loading
                      ? (isResetMode ? 'Sending Link...' : 'Logging in...')
                      : (isResetMode ? 'Send Reset Link' : 'Log in')}
                  </span>
                </Button>
              </div>

              <div
                className={`text-center transform transition-all duration-500 ease-in-out ${
                  isResetMode
                    ? 'opacity-100 max-h-10 scale-y-100 translate-y-0'
                    : 'opacity-0 max-h-0 scale-y-0 -translate-y-4 overflow-hidden'
                }`}
              >
                <button
                  type="button"
                  onClick={handleFormToggle}
                  className="text-sm text-[#800E13] hover:underline transition-colors duration-200"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          </div>

          <div className="flex-1 hidden md:block">
            <img
              src={vjtiBuilding}
              alt="VJTI Building"
              className="object-cover h-full w-full"
            />
          </div>
        </Card>
      </main>

      <section className="my-12 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Quick Access Portal
        </h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {[
            { name: 'PhD Forms', path: '/phd-forms' },
            { name: 'Time Table', path: '/timetable' },
            { name: 'Attendance Portal', path: '/attendance' },
            { name: 'LHCC Booking', path: '/lhcc-booking' },
            { name: 'OASIS Portal', path: '/oasis' },
          ].map((portal, index) => (
            <Link
              key={index}
              to={portal.path}
              className="h-12 sm:h-14 border-2 border-[#9D2235] text-[#9D2235] hover:bg-[#9D2235] hover:text-white font-medium transition-all duration-200 rounded-lg shadow-sm hover:shadow-md flex-shrink-0 inline-flex items-center justify-center px-4 transform hover:scale-105"
            >
              <span className="text-xs sm:text-sm text-center leading-tight">
                {portal.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}