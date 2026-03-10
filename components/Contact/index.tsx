'use client';

import { useState, FormEvent } from 'react';
import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  // State for form fields - UPDATED FOR CONSULTATION
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    consultationDate: '',
    consultationTime: '',
    timezone: 'IST',
    meetingType: 'virtual',
    projectType: 'ai-automation',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Contact details
  const contactInfo = {
    email: 'opsoraagency@gmail.com',
    phone: '+91 8401765505'
  };

  // Time options for consultation
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  // Project types
  const projectTypes = [
    { value: 'ai-automation', label: 'AI Automation' },
    { value: 'lead-generation', label: 'Lead Generation' },
    { value: 'process-optimization', label: 'Process Optimization' },
    { value: 'custom-ai', label: 'Custom AI Solution' },
    { value: 'data-analytics', label: 'Data Analytics' },
    { value: 'other', label: 'Other' }
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate next business day (skip weekends)
  const getNextBusinessDay = () => {
    const today = new Date();
    let nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    
    // Skip Saturday and Sunday
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay.toISOString().split('T')[0];
  };

  // Handle form submission - UPDATED WITH USER EMAIL
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Generate a unique Consultation ID
    const consultationId = 'CON-' + Math.floor(100000 + Math.random() * 900000);

    try {
      // Prepare Admin Email Payload (to opsoraagency@gmail.com)
      const adminEmailPayload = {
        to: 'opsoraagency@gmail.com',
        subject: `[${consultationId}] Consultation Request from ${formData.name}`,
        html: `
          <h2>New Consultation Request</h2>
          <h3>Consultation ID: ${consultationId}</h3>
          
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
          
          <h3>Consultation Details</h3>
          <p><strong>Date:</strong> ${formData.consultationDate}</p>
          <p><strong>Time:</strong> ${formData.consultationTime} (${formData.timezone})</p>
          <p><strong>Meeting Type:</strong> ${formData.meetingType === 'virtual' ? 'Virtual Meeting' : 'Phone Call'}</p>
          <p><strong>Project Type:</strong> ${projectTypes.find(p => p.value === formData.projectType)?.label}</p>
          
          <h3>Additional Message</h3>
          <p>${formData.message || 'No additional message provided.'}</p>
          
          <hr>
          <p><em>This consultation request was submitted from the Schedule Consultation.</em></p>
        `,
      };

      // Prepare User Confirmation Email Payload (to user's email)
      const userEmailPayload = {
        to: formData.email,
        subject: `✅ Consultation Request Received: ${consultationId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
             <div style="text-align: center; margin-bottom: 30px; background-color: #000000; padding: 20px; border-radius: 10px 10px 0 0;">
  <img 
    src="https://opsoraagency.vercel.app/images/logo/logo.svg" 
    alt="Opsora Agency" 
    style="height: 50px; width: auto; display: block; margin: 0 auto;"
  />
  <h2 style="color: white; margin: 15px 0 0 0;">Consultation Request Received</h2>
</div>
            
            <p style="color: #333; margin-bottom: 20px;">Dear ${formData.name},</p>
            <p style="color: #666; margin-bottom: 20px;">Thank you for scheduling a free consultation with Opsora Agency. We're excited to discuss how we can help your business grow with AI and automation.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 16px; color: #333;"><strong>Your Consultation ID:</strong></p>
              <p style="font-size: 24px; font-weight: bold; color: #1e40af; margin: 10px 0;">${consultationId}</p>
            </div>
            
            <h3 style="color: #333;">Consultation Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.consultationDate || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.consultationTime || 'Not specified'} (${formData.timezone})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Meeting Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.meetingType === 'virtual' ? 'Virtual Meeting' : 'Phone Call'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Project Focus:</strong></td>
                <td style="padding: 8px 0; color: #333;">${projectTypes.find(p => p.value === formData.projectType)?.label}</td>
              </tr>
            </table>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #333; margin: 0;"><strong>⏱️ What's Next:</strong></p>
              <ul style="color: #666; margin: 10px 0 0 20px; padding-left: 0;">
                <li>We will confirm your consultation schedule within 24 hours</li>
                <li>A calendar invitation will be sent to your email</li>
                <li>You'll receive a customized growth plan after the 30-minute session</li>
                <li>${formData.meetingType === 'virtual' ? 'A video meeting link will be provided' : 'Our expert will call you at ' + formData.phone}</li>
              </ul>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px;">
              <p style="color: #333; margin: 0;"><strong>📝 Your Message:</strong></p>
              <p style="color: #666; margin: 5px 0 0 0;">${formData.message || 'No additional message provided.'}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #888; font-size: 12px; text-align: center;">
              Need to reschedule? Email us at <a href="mailto:opsoraagency@gmail.com" style="color: #1e40af;">opsoraagency@gmail.com</a><br>
              &copy; ${new Date().getFullYear()} Opsora Agency. All rights reserved.
            </p>
          </div>
        `,
      };

      // Prepare the storage payload for Google Sheets
      const storagePayload = {
        consultationId: consultationId,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        companyName: formData.company,
        consultationDate: formData.consultationDate,
        consultationTime: formData.consultationTime,
        timezone: formData.timezone,
        meetingType: formData.meetingType,
        projectType: formData.projectType,
        messageContent: formData.message,
        inquirySubject: 'Consultation Request',
        formType: 'Consultation'
      };

      // Run operations (Admin Email + User Email + Sheet)
      const [adminEmailRes, userEmailRes, storageRes] = await Promise.allSettled([
        // 1. Send admin email
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminEmailPayload),
        }),
        // 2. Send user confirmation email (NEW)
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userEmailPayload),
        }),
        // 3. Save to Google Sheets
        fetch('/api/schadule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(storagePayload),
        })
      ]);

      // Handle results
      let successMessage = '';
      let errorMessage = '';
      
      // Check admin email response
      if (adminEmailRes.status === 'fulfilled' && adminEmailRes.value.ok) {
        successMessage = '✅ Consultation request sent successfully.';
      } else {
        errorMessage = '❌ Email failed. ';
      }
      
      // Check user email response (log but don't affect main success)
      if (userEmailRes.status === 'fulfilled' && userEmailRes.value.ok) {
        console.log('User confirmation email sent successfully');
      } else {
        console.error('User email failed but form still submitted');
      }
      
      // Check storage response
      if (storageRes.status === 'fulfilled' && storageRes.value.ok) {
        successMessage += ' Data saved successfully.';
      } else {
        errorMessage += 'Data storage failed. ';
        // Silently fail storage - don't show error to user
        console.log('Storage failed (non-critical):', storageRes.reason);
      }
      
      // Set final message
      if (successMessage.includes('✅')) {
        let message = `Thank you! Your consultation request has been submitted. Consultation ID: ${consultationId}. We will confirm your schedule via email within 24 hours.`;
        
        // Add confirmation about user email if sent
        if (userEmailRes.status === 'fulfilled' && userEmailRes.value.ok) {
          message = `✅ Thank you! Your consultation request has been submitted. Consultation ID: ${consultationId}. A confirmation email has been sent to ${formData.email}. We will confirm your schedule within 24 hours.`;
        }
        
        setSubmitMessage(message);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          consultationDate: '',
          consultationTime: '',
          timezone: 'IST',
          meetingType: 'virtual',
          projectType: 'ai-automation',
          message: ''
        });
      } else {
        setSubmitMessage(`${errorMessage}Please try again or contact us directly at ${contactInfo.email}`);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      setSubmitMessage('Network error. Please try again or contact us directly at opsoraagency@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default date to next business day
  const defaultDate = getNextBusinessDay();

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Schedule Your Free Consultation
              </h2>
              <p className="mb-8 text-base font-medium text-body-color">
                Book a 30-minute strategy session and receive a customized growth plan for your business.
              </p>
              
              {/* Minimal Contact Information */}
              <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                    <svg className="h-4 w-4 text-body-color dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <a 
                      href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                      className="text-base font-medium text-black hover:text-primary dark:text-white dark:hover:text-primary transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                    <svg className="h-4 w-4 text-body-color dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-base font-medium text-black hover:text-primary dark:text-white dark:hover:text-primary transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  {/* Basic Information */}
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@company.com"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="phone"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 1234567890"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="company"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your Company"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                  </div>

                  {/* Consultation Details
                  <div className="w-full px-4">
                    <h3 className="mb-6 text-lg font-semibold text-black dark:text-white border-b pb-2">
                      Consultation Details
                    </h3>
                  </div>*/}

                  <div className="w-full px-4 md:w-1/3">
                    <div className="mb-8">
                      <label
                        htmlFor="consultationDate"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="consultationDate"
                        value={formData.consultationDate}
                        onChange={handleInputChange}
                        min={defaultDate}
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/3">
                    <div className="mb-8">
                      <label
                        htmlFor="consultationTime"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Preferred Time *
                      </label>
                      <select
                        name="consultationTime"
                        value={formData.consultationTime}
                        onChange={handleInputChange}
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        required
                      >
                        <option value="">Select a time slot</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/3">
                    <div className="mb-8">
                     {/* <label
                        htmlFor="timezone"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Timezone *
                      </label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        required
                      >
                        <option value="IST">IST (India Standard Time)</option>
                        <option value="EST">EST (Eastern Time)</option>
                        <option value="PST">PST (Pacific Time)</option>
                        <option value="GMT">GMT (Greenwich Mean Time)</option>
                        <option value="CET">CET (Central European Time)</option>
                      </select>*/}
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="meetingType"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Meeting Type *
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="meetingType"
                            value="virtual"
                            checked={formData.meetingType === 'virtual'}
                            onChange={handleInputChange}
                            className="mr-2"
                            required
                          />
                          <span>Virtual Meeting</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="meetingType"
                            value="phone"
                            checked={formData.meetingType === 'phone'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <span>Phone Call</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      {/*<label
                        htmlFor="projectType"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Project Type *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        required
                      >
                        {projectTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>*/}
                    </div>
                  </div>

                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Tell us about your project or specific challenges
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Briefly describe what you'd like to achieve with AI automation..."
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="w-full px-4">
                    {/* Success/Error Message */}
                    {submitMessage && (
                      <div className={`mb-6 rounded-md p-4 ${submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
                        {submitMessage}
                      </div>
                    )}

                    <div className="mb-4 text-sm text-body-color dark:text-gray-400">
                      <p>⏱ Consultation duration: 30 minutes</p>
                      <p>You'll receive a customized growth plan after the session</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="shadow-submit dark:shadow-submit-dark rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 disabled:opacity-70"
                    >
                      {isSubmitting ? 'Scheduling...' : 'Schedule Free Consultation'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
