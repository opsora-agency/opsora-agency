'use client';
import { useState, FormEvent, useEffect } from 'react';

const SupportPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    priority: 'medium',
    subject: '',
    message: '',
  });

  // OTP related state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  // Auto-verify OTP when user enters 6 digits
  useEffect(() => {
    if (otpValue.length === 6 && generatedOtp) {
      if (otpValue === generatedOtp) {
        setOtpVerified(true);
        setSubmitMessage('✅ Email verified successfully!');
        setSubmitStatus('success');
        setTimeout(() => {
          setSubmitMessage('');
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitMessage('❌ Invalid OTP. Please try again.');
        setSubmitStatus('error');
      }
    }
  }, [otpValue, generatedOtp]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  // Send OTP via Email
  const sendOTP = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setSubmitMessage('Please enter a valid email address');
      setSubmitStatus('error');
      return;
    }

    setIsSendingOtp(true);
    setSubmitMessage('');

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
          subject: 'Your OTP for Support Ticket - Opsora Agency',
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
                <p style="font-size: 16px; color: #333;">Your OTP for support ticket verification is:</p>
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
        setSubmitMessage(`✅ OTP sent to ${formData.email}`);
        setSubmitStatus('success');
        setTimeout(() => {
          setSubmitMessage('');
          setSubmitStatus(null);
        }, 5000);
      } else {
        setSubmitMessage(`❌ Failed to send OTP. Please try again.`);
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitMessage('❌ Network error. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle form submission - UPDATED VERSION with OTP verification
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Check if email is entered
    if (!formData.email) {
      setSubmitMessage('Error: Please enter your email address.');
      setSubmitStatus('error');
      return;
    }

    // If OTP not sent yet, send it first
    if (!otpSent) {
      await sendOTP();
      return;
    }

    // If OTP sent but not verified
    if (otpSent && !otpVerified) {
      setSubmitMessage('Error: Please enter the correct OTP sent to your email.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    // Generate a unique Ticket ID
    const ticketId = '#' + Math.floor(100000 + Math.random() * 900000);

    try {
      // 1. Prepare Storage Payload
      const storagePayload = {
        ticketId: ticketId,
        customerName: formData.name,
        customerEmail: formData.email,
        priority: formData.priority,
        category: formData.category,
        inquirySubject: formData.subject,
        messageContent: formData.message,
        verified: true
      };

      // 2. Prepare Admin Email Payload (to opsoraagency@gmail.com)
      const adminEmailPayload = {
        to: 'opsoraagency@gmail.com',
        subject: `[${formData.priority.toUpperCase()}] ${formData.subject || `Support Ticket from ${formData.name}`}`,
        html: `
          <h2>New Ticket ${ticketId}</h2>
          <p><strong>Email Verified:</strong> Yes ✓</p>
          <h3>Ticket Information</h3>
          <p><strong>Priority:</strong> <span style="padding: 2px 8px; border-radius: 4px; background: ${
            formData.priority === 'urgent' ? '#dc2626' : 
            formData.priority === 'high' ? '#ea580c' : 
            formData.priority === 'medium' ? '#ca8a04' : 
            '#2563eb'
          }; color: white;">${formData.priority.toUpperCase()}</span></p>
          <p><strong>Category:</strong> ${formData.category.charAt(0).toUpperCase() + formData.category.slice(1)}</p>
          
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email} (Verified)</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          
          <h3>Message</h3>
          <p>${formData.message}</p>
          
          <hr>
          <p><em>This support ticket was submitted from the Opsora Agency support page with verified email.</em></p>
          <p><strong>Client Email for reply:</strong> ${formData.email}</p>
        `,
      };

      // 3. Prepare User Confirmation Email Payload (to user's email)
      const userEmailPayload = {
        to: formData.email,
        subject: `✅ Support Ticket Received: ${ticketId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px; background-color: #000000; padding: 20px; border-radius: 10px 10px 0 0;">
              <img 
                src="https://opsoraagency.vercel.app/images/logo/logo.svg" 
                alt="Opsora Agency" 
                style="height: 50px; width: auto; display: block; margin: 0 auto;"
              />
              <h2 style="color: white; margin: 15px 0 0 0;">Support Ticket Received</h2>
            </div>
            
            <p style="color: #333; margin-bottom: 20px;">Dear ${formData.name},</p>
            <p style="color: #666; margin-bottom: 20px;">Thank you for contacting Opsora Agency Support. Your ticket has been created successfully.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 16px; color: #333;"><strong>Your Ticket ID:</strong></p>
              <p style="font-size: 24px; font-weight: bold; color: #1e40af; margin: 10px 0;">${ticketId}</p>
            </div>
            
            <h3 style="color: #333;">Ticket Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Subject:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Priority:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.priority}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Category:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.category}</td>
              </tr>
            </table>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #333; margin: 0;"><strong>⏱️ Expected Response Time:</strong></p>
              <p style="color: #666; margin: 10px 0 0 0;">
                ${formData.priority === 'urgent' ? '2-4 hours' : 
                  formData.priority === 'high' ? '4-8 hours' : 
                  formData.priority === 'medium' ? '24 hours' : '48 hours'}
              </p>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #333; margin: 0;"><strong>📝 Your Message:</strong></p>
              <p style="color: #666; margin: 10px 0 0 0;">${formData.message}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #888; font-size: 12px; text-align: center;">
              For urgent matters, contact us on WhatsApp: +91 8401765505<br>
              &copy; ${new Date().getFullYear()} Opsora Agency. All rights reserved.
            </p>
          </div>
        `,
      };

      // 4. Run operations (Admin Email + User Email + Sheet)
      const [adminEmailRes, userEmailRes, storageRes] = await Promise.allSettled([
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminEmailPayload),
        }),
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userEmailPayload),
        }),
        fetch('/api/store-support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(storagePayload),
        })
      ]);

      // 5. Handle Success (Checking if admin email worked as primary success indicator)
      if (adminEmailRes.status === 'fulfilled' && adminEmailRes.value.ok) {
        let message = `Thank you! Your support ticket has been submitted. Ticket ID: ${ticketId}`;
        
        // Check if user email was also sent
        if (userEmailRes.status === 'fulfilled' && userEmailRes.value.ok) {
          message += ` A confirmation email has been sent to ${formData.email}.`;
        } else {
          message += ` We couldn't send a confirmation email, but your ticket is registered.`;
        }
        
        setSubmitStatus('success');
        setSubmitMessage(message);
        
        // Reset form
        setFormData({
          name: '', 
          email: '', 
          category: 'general', 
          priority: 'medium', 
          subject: '', 
          message: '',
        });
        
        // Reset OTP state
        setOtpSent(false);
        setOtpVerified(false);
        setOtpValue('');
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
          setSubmitMessage('');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage('Something went wrong. Please try again or contact us via WhatsApp.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="overflow-hidden pb-20 pt-[180px]">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            {/* Page Header */}
            <div className="mb-12 text-center sm:mb-16">
              <h1 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                Support Center
              </h1>
              <p className="mx-auto max-w-2xl text-base font-medium text-body-color dark:text-body-color-dark">
                Get help with our services. Submit a support ticket and our team will respond within 24 hours.
              </p>
            </div>

            <div className="-mx-4 mb-12 flex flex-wrap">
              {/* Quick Help Cards */}
              <div className="mb-8 w-full px-4 lg:mb-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Card 1 */}
                  <div className="rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-10">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-black dark:text-white">Account Issues</h3>
                    <p className="text-body-color dark:text-body-color-dark">
                      Login problems, account settings, profile updates, or access issues.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-10">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-black dark:text-white">Billing & Payments</h3>
                    <p className="text-body-color dark:text-body-color-dark">
                      Invoice questions, payment methods, subscription changes, or refund requests.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-10">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-black dark:text-white">Technical Problems</h3>
                    <p className="text-body-color dark:text-body-color-dark">
                      Bug reports, errors, performance issues, or technical difficulties with our services.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-10">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-black dark:text-white">Feature Requests</h3>
                    <p className="text-body-color dark:text-body-color-dark">
                      Suggest new features, improvements, or changes to our services.
                    </p>
                  </div>

                  {/* Card 5 */}
                  <div className="rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-10">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-black dark:text-white">Account Security</h3>
                    <p className="text-body-color dark:text-body-color-dark">
                      Security concerns, suspicious activity, password resets, or 2FA issues.
                    </p>
                  </div>

                  {/* Card 6 */}
                  <div className="rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-10">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-black dark:text-white">API & Integration</h3>
                    <p className="text-body-color dark:text-body-color-dark">
                      API documentation, integration help, webhooks, or developer support.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Ticket Form */}
            <div className="-mx-4 mb-16 flex flex-wrap items-stretch">
              {/* Support Form */}
              <div className="mb-8 w-full px-4 lg:mb-0 lg:w-8/12">
                <div className="h-full rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none sm:p-8 lg:p-10">
                  <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:mb-8">
                    Submit a Support Ticket
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="-mx-4 mb-6 flex flex-wrap sm:mb-8">
                      <div className="mb-6 w-full px-4 sm:mb-0 sm:w-1/2">
                        <label className="mb-2 block text-sm font-medium text-dark dark:text-white sm:mb-3">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none sm:px-6 sm:py-3"
                        />
                      </div>

                      <div className="w-full px-4 sm:w-1/2">
                        <label className="mb-2 block text-sm font-medium text-dark dark:text-white sm:mb-3">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={otpVerified}
                          placeholder="Enter your email address"
                          className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none sm:px-6 sm:py-3"
                        />
                      </div>
                    </div>

                    <div className="-mx-4 mb-6 flex flex-wrap sm:mb-8">
                      <div className="mb-6 w-full px-4 sm:mb-0 sm:w-1/2">
                        <label className="mb-2 block text-sm font-medium text-dark dark:text-white sm:mb-3">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none sm:px-6 sm:py-3"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="account">Account Issues</option>
                          <option value="feature">Feature Request</option>
                          <option value="bug">Bug Report</option>
                          <option value="security">Security Concern</option>
                          <option value="api">API & Integration</option>
                        </select>
                      </div>

                      <div className="w-full px-4 sm:w-1/2">
                        <label className="mb-2 block text-sm font-medium text-dark dark:text-white sm:mb-3">
                          Priority *
                        </label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className={`w-full rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none sm:px-6 sm:py-3 ${getPriorityColor(formData.priority)}`}
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6 sm:mb-8">
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white sm:mb-3">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your issue"
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none sm:px-6 sm:py-3"
                      />
                    </div>

                    <div className="mb-8 sm:mb-10">
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white sm:mb-3">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you were trying to accomplish."
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none sm:px-6 sm:py-3"
                      />
                    </div>

                    {/* OTP Section - Above submit button */}
                    {otpSent && !otpVerified && (
                      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <div className="flex justify-center">
                          <div className="w-full max-w-md">
                            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
                              <label className="mb-3 block text-center text-sm font-medium text-body-color">
                                Enter 6-digit OTP sent to <span className="font-semibold text-primary">{formData.email}</span>
                              </label>
                              <input
                                type="text"
                                value={otpValue}
                                onChange={(e) => setOtpValue(e.target.value)}
                                placeholder="------"
                                maxLength={6}
                                className="w-full text-center text-2xl tracking-[0.5em] font-mono rounded-lg border border-gray-300 bg-white px-4 py-4 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                              />
                              <div className="mt-4 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={sendOTP}
                                  disabled={otpTimer > 0 || isSendingOtp}
                                  className="text-sm text-primary hover:underline disabled:opacity-50 flex items-center gap-1"
                                >
                                  {isSendingOtp ? (
                                    <>
                                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      <span>Sending...</span>
                                    </>
                                  ) : (
                                    otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'
                                  )}
                                </button>
                                {otpTimer > 0 && (
                                  <span className="text-xs text-body-color">OTP expires in {otpTimer}s</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {otpVerified && (
                      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <div className="flex justify-center">
                          <div className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-6 py-3 rounded-lg">
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Email verified successfully</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                      {submitMessage && (
                        <div className={`mb-4 rounded-lg p-4 ${
                          submitStatus === 'success' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {submitMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting || isSendingOtp}
                        className={`w-full rounded-sm bg-primary px-6 py-3 text-base font-medium text-white shadow-submit duration-300 hover:bg-opacity-90 dark:shadow-submit-dark sm:px-9 sm:py-4 ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting Ticket...
                          </>
                        ) : isSendingOtp ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending OTP...
                          </>
                        ) : (
                          'Submit Support Ticket'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Support Information */}
              <div className="w-full px-4 lg:w-4/12">
                <div className="h-full rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none sm:p-8 lg:p-10">
                  <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:mb-8">
                    Support Information
                  </h2>

                  <div className="mb-8 sm:mb-10">
                    <div className="mb-6">
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Response Times</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-body-color dark:text-body-color-dark">Urgent Priority</span>
                          <span className="font-medium text-red-600">2-4 hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-color dark:text-body-color-dark">High Priority</span>
                          <span className="font-medium text-orange-600">4-8 hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-color dark:text-body-color-dark">Medium Priority</span>
                          <span className="font-medium text-yellow-600">24 hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-color dark:text-body-color-dark">Low Priority</span>
                          <span className="font-medium text-blue-600">48 hours</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Contact Methods</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary bg-opacity-10">
                            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-dark dark:text-white">Phone Support</h4>
                            <p className="text-sm text-body-color dark:text-body-color-dark">+91 8401765505</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary bg-opacity-10">
                            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-dark dark:text-white">Email Support</h4>
                            <p className="text-sm text-body-color dark:text-body-color-dark">opsoraagency@gmail.com</p>
                          </div>
                        </div>

                        {/* WhatsApp Button */}
                        <a
                          href="https://wa.me/918401765505?text=Hi%20Opsora%20Agency%20Support%2C%20I%20need%20help%20with%20an%20issue."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center rounded-sm bg-green-600 px-4 py-3 text-center text-white duration-300 hover:bg-green-700"
                        >
                          <svg
                            className="mr-3 h-5 w-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.897 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                          </svg>
                          <span className="text-sm font-medium text-white">
                            WhatsApp Support
                          </span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Business Hours</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-body-color dark:text-body-color-dark">Monday - Friday</span>
                          <span className="font-medium text-dark dark:text-white">9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-body-color dark:text-body-color-dark">Saturday</span>
                          <span className="font-medium text-dark dark:text-white">10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-body-color dark:text-body-color-dark">Sunday</span>
                          <span className="font-medium text-dark dark:text-white">Emergency Only</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips Section */}
                  <div className="rounded-sm bg-primary bg-opacity-5 p-4 dark:bg-opacity-10">
                    <h4 className="mb-2 font-bold text-primary dark:text-white">Tips for Faster Support</h4>
                    <ul className="space-y-2 text-sm text-body-color dark:text-body-color-dark">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Include error messages and screenshots
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Describe steps to reproduce the issue
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Specify your browser/device details
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Provide account/order numbers when applicable
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportPage;
