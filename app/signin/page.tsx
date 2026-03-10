'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Remove the metadata export from this client component

// Encryption/Decryption utilities
const decryptData = (encryptedData: string): string => {
  try {
    return atob(encryptedData);
  } catch {
    return '';
  }
};

const encryptData = (data: string): string => {
  return btoa(data);
};

// Forgot Password Modal Component
const ForgotPasswordModal = ({ isOpen, onClose, gasUrl, onSuccess }: any) => {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  const sendOTP = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    // Check if email exists
    try {
      const checkResponse = await fetch(`${gasUrl}?action=checkEmail&email=${encodeURIComponent(email)}`);
      const checkData = await checkResponse.json();

      if (!checkData.exists) {
        setError('Email not found in our records');
        setIsLoading(false);
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      // Send OTP
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Password Reset OTP - Opsora Agency',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 30px; background-color: #000000; padding: 20px; border-radius: 10px 10px 0 0;">
  <img 
    src="https://opsoraagency.vercel.app/images/logo/logo.svg" 
    alt="Opsora Agency" 
    style="height: 50px; width: auto; display: block; margin: 0 auto;"
  />
  <h2 style="color: white; margin: 15px 0 0 0;">Password Reset Request</h2>
</div>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="font-size: 16px; color: #333;">Your OTP for password reset is:</p>
                <p style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 5px; margin: 20px 0;">${otp}</p>
                <p style="font-size: 14px; color: #666;">This OTP is valid for 5 minutes.</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
                <p>If you didn't request this, please ignore this email.</p>
              </div>
            </div>
          `
        })
      });

      if (response.ok) {
        setStep('otp');
        setOtpTimer(60);
        setSuccess('OTP sent to your email');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to send OTP');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    if (otp === generatedOtp) {
      setStep('newPassword');
      setError('');
    } else {
      setError('Invalid OTP');
    }
  };

  const resetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const encryptedPassword = encryptData(newPassword);

      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updatePassword',
          email: email,
          password: encryptedPassword
        })
      });

      // Log activity
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logActivity',
          type: 'passwordReset',
          email: email,
          timestamp: new Date().toISOString()
        })
      });

      setSuccess('Password updated successfully!');
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setError('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white/90 backdrop-blur-xl p-8 shadow-2xl dark:bg-gray-800/90">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
          {step === 'email' && 'Reset Password'}
          {step === 'otp' && 'Verify OTP'}
          {step === 'newPassword' && 'Create New Password'}
        </h2>

        {step === 'email' && (
          <div className="space-y-4">
            <p className="text-sm text-body-color">Enter your email to receive OTP</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
            />
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-sm text-body-color">Enter the 6-digit OTP sent to {email}</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
            />
            <button
              onClick={sendOTP}
              disabled={otpTimer > 0}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
            </button>
          </div>
        )}

        {step === 'newPassword' && (
          <div className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white"
            />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => {
              if (step === 'email') sendOTP();
              if (step === 'otp') verifyOTP();
              if (step === 'newPassword') resetPassword();
            }}
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 
             step === 'email' ? 'Send OTP' : 
             step === 'otp' ? 'Verify OTP' : 
             'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SigninPage = () => {
  const router = useRouter();
  const [gasUrl, setGasUrl] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Get GAS URL
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SS_URL;
    if (url) {
      setGasUrl(url);
    } else {
      setError('Configuration error. Please contact support.');
    }
  }, []);

  // Handle signin
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Fetch user data
      const response = await fetch(`${gasUrl}?action=getUser&email=${encodeURIComponent(formData.email)}`);
      const data = await response.json();

      if (data.success && data.user) {
        // Decrypt and verify password
        const decryptedPassword = decryptData(data.user.password);
        
        if (decryptedPassword === formData.password) {
          // Login successful
          
          // Log activity
          await fetch(gasUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'logActivity',
              type: 'signin',
              email: formData.email,
              timestamp: new Date().toISOString()
            })
          });

          // Store session
          const sessionData = {
            user: {
              name: data.user.name,
              email: data.user.email
            },
            expires: keepSignedIn ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000 // 30 days or 1 day
          };
          
          localStorage.setItem('opsora_session', JSON.stringify(sessionData));
          
          setSuccess('Login successful! Redirecting...');
          
          // Redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          setError('Invalid password');
        }
      } else {
        setError('Email not found');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Sign in to your account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Welcome back! Please enter your details
                </p>

                <form onSubmit={handleSignin}>
                  <div className="mb-8">
                    <label className="mb-3 block text-sm text-dark dark:text-white">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your Email"
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:shadow-none"
                      required
                    />
                  </div>

                  <div className="mb-8">
                    <label className="mb-3 block text-sm text-dark dark:text-white">
                      Your Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter your Password"
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:shadow-none"
                      required
                    />
                  </div>

                  <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <label className="flex cursor-pointer select-none items-center text-sm font-medium text-body-color">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={keepSignedIn}
                            onChange={(e) => setKeepSignedIn(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`box mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                            keepSignedIn ? 'border-primary bg-primary' : 'border-body-color border-opacity-20'
                          }`}>
                            {keepSignedIn && (
                              <svg
                                width="11"
                                height="8"
                                viewBox="0 0 11 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                  fill="white"
                                  stroke="white"
                                  strokeWidth="0.4"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        Keep me signed in
                      </label>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  {/* Error/Success Messages */}
                  {error && (
                    <div className="mb-6 rounded border-l-4 border-red-500 bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-6 rounded border-l-4 border-green-500 bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      {success}
                    </div>
                  )}

                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>

                <p className="text-center text-base font-medium text-body-color">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        gasUrl={gasUrl}
        onSuccess={() => {
          setSuccess('Password reset successful! You can now sign in.');
        }}
      />
    </>
  );
};

export default SigninPage;
