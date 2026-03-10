'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Remove the metadata export from this client component
// Metadata should be in a separate server component or layout

// Encryption/Decryption utilities
const encryptData = (data: string): string => {
  // Simple base64 encoding (you can use a more secure method in production)
  return btoa(data);
};

const decryptData = (encryptedData: string): string => {
  try {
    return atob(encryptedData);
  } catch {
    return '';
  }
};

const SignupPage = () => {
  const router = useRouter();
  const [gasUrl, setGasUrl] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Get GAS URL
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SS_URL;
    if (url) {
      setGasUrl(url);
    } else {
      setError('Configuration error. Please contact support.');
    }
  }, []);

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  // Send OTP via Email
  const sendOTP = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    try {
      // Send OTP via email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.email,
          subject: 'Verify Your Email - Opsora Agency Signup',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 30px; background-color: #000000; padding: 20px; border-radius: 10px 10px 0 0;">
  <img 
    src="https://opsoraagency.vercel.app/images/logo/logo.svg" 
    alt="Opsora Agency" 
    style="height: 50px; width: auto; display: block; margin: 0 auto;"
  />
  <h2 style="color: white; margin: 15px 0 0 0;">Email Verification</h2>
</div>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="font-size: 16px; color: #333;">Your OTP for email verification is:</p>
                <p style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 5px; margin: 20px 0;">${otp}</p>
                <p style="font-size: 14px; color: #666;">This OTP is valid for 5 minutes.</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
                <p>If you didn't request this OTP, please ignore this email.</p>
                <p>&copy; ${new Date().getFullYear()} Opsora Agency. All rights reserved.</p>
              </div>
            </div>
          `
        })
      });

      if (response.ok) {
        setOtpSent(true);
        setOtpTimer(60);
        setSuccess(`✅ OTP sent to ${formData.email}`);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = () => {
    if (!otpValue || otpValue.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    if (otpValue === generatedOtp) {
      setOtpVerified(true);
      setSuccess('✅ Email verified successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('❌ Invalid OTP. Please try again.');
    }
  };

  // Check if email already exists
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${gasUrl}?action=checkEmail&email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists;
    } catch {
      return false;
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!otpVerified) {
      setError('Please verify your email with OTP');
      return;
    }

    if (!termsAccepted) {
      setError('You must agree to the Terms and Conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setError('Email already registered. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      // Encrypt password
      const encryptedPassword = encryptData(formData.password);

      // Prepare user data
      const userData = {
        action: 'signup',
        name: formData.name,
        email: formData.email,
        password: encryptedPassword,
        createdAt: new Date().toISOString(),
        verified: true
      };

      // Save to Google Sheets
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      // Log activity
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logActivity',
          type: 'signup',
          email: formData.email,
          timestamp: new Date().toISOString()
        })
      });

      // Send welcome email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.email,
          subject: '🎉 Welcome to Opsora Agency!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
<div style="text-align: center; margin-bottom: 30px; background-color: #000000; padding: 20px; border-radius: 10px 10px 0 0;">
  <img 
    src="https://opsoraagency.vercel.app/images/logo/logo.svg" 
    alt="Opsora Agency" 
    style="height: 50px; width: auto; display: block; margin: 0 auto;"
  />
  <h2 style="color: white; margin: 15px 0 0 0;">Welcome, ${formData.name}!</h2>
</div>

          
              
              <p style="color: #333; margin-bottom: 20px;">Thank you for creating an account with Opsora Agency.</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: #333; margin: 0;"><strong>Your account has been created successfully.</strong></p>
                <p style="color: #666; margin: 10px 0 0 0;">You can now access all our services and features.</p>
              </div>





              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_MSS_URL}/dashboard" 
                   style="background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Go to Dashboard
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Opsora Agency. All rights reserved.</p>
              </div>
            </div>
          `
        })
      });

      setSuccess('✅ Account created successfully! Redirecting to login...');
      
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 2000);

    } catch (error) {
      setError('Signup failed. Please try again.');
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
                  Create your account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  It's totally free and super easy
                </p>

                {/* OTP Section */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm text-dark dark:text-white">
                    Email Verification
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={otpVerified}
                      className="flex-1 rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary"
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={isLoading || (otpSent && otpTimer > 0)}
                        className="whitespace-nowrap rounded-sm bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                      >
                        {isLoading ? '...' : otpSent ? `Resend ${otpTimer}s` : 'Send OTP'}
                      </button>
                    )}
                  </div>

                  {/* OTP Input */}
                  {otpSent && !otpVerified && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        maxLength={6}
                        className="flex-1 rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
                      />
                      <button
                        type="button"
                        onClick={verifyOTP}
                        className="whitespace-nowrap rounded-sm bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Verify
                      </button>
                    </div>
                  )}

                  {otpVerified && (
                    <p className="mt-2 text-sm text-green-600">✓ Email verified</p>
                  )}
                </div>

                <form onSubmit={handleSignup}>
                  <div className="mb-8">
                    <label className="mb-3 block text-sm text-dark dark:text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary"
                      required
                    />
                  </div>

                  <div className="mb-8">
                    <label className="mb-3 block text-sm text-dark dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Create a password (min. 8 characters)"
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary"
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="mb-8">
                    <label className="mb-3 block text-sm text-dark dark:text-white">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary"
                      required
                    />
                  </div>

                  <div className="mb-8 flex">
                    <label className="flex cursor-pointer select-none text-sm font-medium text-body-color">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`box mr-4 mt-1 flex h-5 w-5 items-center justify-center rounded border ${
                          termsAccepted ? 'border-primary bg-primary' : 'border-body-color border-opacity-20'
                        }`}>
                          {termsAccepted && (
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
                      <span>
                        By creating account means you agree to the
                        <a href="/terms" className="text-primary hover:underline">
                          {" "}
                          Terms and Conditions
                        </a>
                        , and our
                        <a href="/privacy" className="text-primary hover:underline">
                          {" "}
                          Privacy Policy
                        </a>
                      </span>
                    </label>
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
                      disabled={isLoading || !otpVerified}
                      className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isLoading ? 'Creating account...' : 'Sign up'}
                    </button>
                  </div>
                </form>

                <p className="text-center text-base font-medium text-body-color">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
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
    </>
  );
};

export default SignupPage;
