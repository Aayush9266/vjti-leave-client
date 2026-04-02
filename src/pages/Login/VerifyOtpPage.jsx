// client/src/pages/VerifyOtpPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Assuming @/services is the correct alias
import { verifyOtp, requestPasswordReset } from '@/services/authService';
import Header from '@/components/Header'; // Optional
import Footer from '@/components/Footer'; // Optional
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

const OTP_TIMER_DURATION = 180; // 3 minutes in seconds

function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(OTP_TIMER_DURATION);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const timerRef = useRef(null);

  // Start or clear timer based on the 'timer' state
  useEffect(() => {
    if (!email) {
      toast.error('Email address not found. Please try again.');
      navigate('/login'); // Or your forget-password start page
      return;
    }

    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      toast.error('OTP has expired. Please request a new one.');
    }

    return () => clearInterval(timerRef.current); // Cleanup timer
  }, [email, navigate, timer]); // Re-run effect if timer itself changes (e.g., reset by resend)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timer === 0) {
      toast.error('OTP has expired. Please request a new one.');
      return;
    }
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp(email, otp); // Assuming verifyOtp also returns a message
      toast.success(response.message || 'OTP verified successfully!');
      clearInterval(timerRef.current); // Stop timer on success
      // Navigate to New Password page, passing email and verified OTP (or a token from backend if verifyOtp returns one)
      navigate('/new-password', { state: { email, otp } }); // Passing OTP again, backend should ideally issue a new token
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid OTP or verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await requestPasswordReset(email); // Re-use the requestPasswordReset service
      toast.success('A new OTP has been sent to your email.');
      setTimer(OTP_TIMER_DURATION); // Reset timer
      setOtp(''); // Clear old OTP input
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header /> {/* Optional */}

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
              Verify Your Email
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-600">
              An OTP has been sent to <span className="font-medium text-[#640D14]">{email || 'your email address'}</span>.
              Please enter it below.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-700">Time remaining:</p>
              <p className={`text-2xl font-semibold ${timer > 30 ? 'text-green-600' : 'text-red-600'}`}>
                {formatTime(timer)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="otp" className="sr-only"> {/* Screen reader only if input is self-descriptive */}
                  OTP
                </Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text" // Use "text" for OTPs to allow leading zeros if any, though usually numeric
                  inputMode="numeric" // Hint for mobile keyboards
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} // Allow only digits, max 6
                  required
                  placeholder="Enter 6-digit OTP"
                  className="mt-1 text-center text-lg tracking-widest" // Center text, larger font, wider letter spacing
                  maxLength="6"
                  disabled={timer === 0 || isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#640D14] hover:bg-[#800E13] text-white"
                disabled={isLoading || timer === 0 || otp.length !== 6}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center text-sm text-gray-600 space-y-2 pt-4">
            {timer === 0 && (
              <p className="text-red-600">OTP has expired.</p>
            )}
            <p>Didn't receive the OTP?</p>
            <Button
              variant="link" // Assuming your Button component has a link variant
              onClick={handleResendOtp}
              disabled={isResending || timer > 0} // Disable if timer still running or already resending
              className="font-medium text-[#640D14] hover:text-[#800E13] p-0 h-auto"
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Footer /> {/* Optional */}
    </div>
  );
}

export default VerifyOtpPage;