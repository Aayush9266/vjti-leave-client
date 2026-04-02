// client/src/pages/NewPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Assuming @/services is the correct alias for your services folder
import { resetPassword } from '@/services/authService';
import Header from '@/components/Header'; // Optional: If you have a site header
import Footer from '@/components/Footer'; // Optional: If you have a site footer
import { Input } from '@/components/ui/input'; // Assuming you have a styled Input component
import { Button } from '@/components/ui/button'; // Assuming you have a styled Button component
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Assuming Card components
import { Label } from '@/components/ui/label'; // Assuming Label component
import toast from 'react-hot-toast'; // For better notifications

function NewPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Removed message and error states, will use react-hot-toast
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Initially true to avoid premature error
  const navigate = useNavigate();
  const location = useLocation();

  // It's crucial that email and otp (or a temporary reset token) are passed correctly
  // For enhanced security, the OTP should ideally be verified on the backend,
  // and the backend should issue a short-lived, single-use token for this reset step.
  // This example assumes 'otp' is still valid and passed for simplicity.
  const email = location.state?.email;
  const otp = location.state?.otp; // Or tempResetToken from previous step

  useEffect(() => {
    if (!email || !otp) {
      toast.error('Invalid session. Please start the password reset process again.');
      navigate('/login'); // Redirect to login or a specific "forgot password" starting page
    }
  }, [email, otp, navigate]);

  useEffect(() => {
    if (newPassword && confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(true); // No error if fields are not yet filled or only one is
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }
    if (!passwordsMatch) {
      toast.error('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) { // Example: Basic password policy
        toast.error('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true);
    try {
      const data = await resetPassword(email, otp, newPassword);
      toast.success(data.message || 'Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header /> {/* Optional */}

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
              Set New Password
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-600">
              Choose a strong new password for your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter new password"
                  aria-describedby="password-criteria"
                />
                <p id="password-criteria" className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters long.
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Confirm new password"
                />
              </div>

              {!passwordsMatch && newPassword && confirmPassword && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  Passwords do not match.
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-[#640D14] hover:bg-[#800E13] text-white"
                disabled={isLoading || !passwordsMatch || !newPassword || !confirmPassword}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-600">
            Remembered your password?{' '}
            <a href="/login" className="font-medium text-[#640D14] hover:text-[#800E13]">
              Log in
            </a>
          </CardFooter>
        </Card>
      </main>

      <Footer /> {/* Optional */}
    </div>
  );
}

export default NewPasswordPage;