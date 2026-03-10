'use client';

import { useState, FormEvent } from 'react';

const DemoBookingPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    otherIndustry: '',
    mainService: '',
    subServices: [] as string[],
    demoDate: '',
    demoTime: '',
    timezone: 'IST',
    attendees: '1-2',
    demoType: 'online',
    platform: 'zoom',
    currentChallenges: '',
    demoGoals: '',
    referralSource: '',
    preferredContact: 'email',
    privacyConsent: false,
    marketingConsent: false,
    specialRequirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Services data
  const services = {
    'Digital Marketing Service': [
      'SEO Strategy & Audit Demo',
      'Google Ads (PPC) Demo',
      'Social Media Marketing Demo',
      'Content Marketing Demo',
      'Complete Digital Marketing Funnel Demo',
    ],
    'Automation / AI-Agents': [
      'AI Workflow Automation Demo',
      'Custom AI Chatbot Demo',
      'Sales AI Agent Demo',
      'Support AI Agent Demo',
      'Complete AI Solution Demo',
    ],
    'Website Development Service': [], // No sub-services
  };

  // Time slots for demo
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:30 AM - 11:30 AM',
    '12:00 PM - 1:00 PM',
    '2:00 PM - 3:00 PM',
    '3:30 PM - 4:30 PM',
    '5:00 PM - 6:00 PM',
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle checkbox changes for sub-services
  const handleCheckboxChange = (service: string) => {
    setFormData(prev => {
      if (prev.subServices.includes(service)) {
        return {
          ...prev,
          subServices: prev.subServices.filter(s => s !== service)
        };
      } else {
        return {
          ...prev,
          subServices: [...prev.subServices, service]
        };
      }
    });
  };

  // Handle form submission - UPDATED VERSION with user email
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Check privacy consent
    if (!formData.privacyConsent) {
      setSubmitMessage('Error: You must agree to the Privacy Policy to submit the form.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');

    // Generate a unique Demo ID
    const demoId = 'DEMO-' + Math.floor(100000 + Math.random() * 900000);

    try {
      console.log('Submitting demo booking:', formData);
      
      // 1. Prepare Storage Payload
      const storagePayload = {
        demoId: demoId,
        customerName: formData.name,
        customerEmail: formData.email,
        contactPhone: formData.phone,
        businessName: formData.company,
        positionTitle: formData.jobTitle,
        industryType: formData.industry === 'Other' ? formData.otherIndustry : formData.industry,
        budgetRange: '', // Not in current form
        timelinePreference: '', // Not in current form
        mainService: formData.mainService,
        selectedServices: formData.subServices,
        currentProblems: formData.currentChallenges,
        projectAims: formData.demoGoals,
        additionalNotes: formData.specialRequirements,
        howFoundUs: formData.referralSource,
        contactPreference: formData.preferredContact,
        marketingAgreement: formData.marketingConsent,
        demoDate: formData.demoDate,
        demoTime: formData.demoTime,
        timezone: formData.timezone,
        numberOfAttendees: formData.attendees,
        demoType: formData.demoType,
        platform: formData.platform
      };

      // 2. Prepare Admin Email Payload (to opsoraagency@gmail.com)
      const adminEmailPayload = {
        to: 'opsoraagency@gmail.com',
        subject: `[${demoId}] New Demo Booking: ${formData.mainService}`,
        html: `
          <h2>New Demo Booking Request</h2>
          <h3>Demo ID: ${demoId}</h3>
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
          <p><strong>Job Title:</strong> ${formData.jobTitle || 'Not provided'}</p>
          <p><strong>Industry:</strong> ${formData.industry === 'Other' ? formData.otherIndustry : formData.industry || 'Not specified'}</p>
          <p><strong>How did you hear about us?</strong> ${formData.referralSource || 'Not specified'}</p>
          <p><strong>Preferred Contact:</strong> ${formData.preferredContact}</p>
          
          <h3>Demo Schedule</h3>
          <p><strong>Demo Date:</strong> ${formData.demoDate || 'Not specified'}</p>
          <p><strong>Demo Time:</strong> ${formData.demoTime || 'Not specified'}</p>
          <p><strong>Timezone:</strong> ${formData.timezone}</p>
          <p><strong>Number of Attendees:</strong> ${formData.attendees}</p>
          <p><strong>Demo Type:</strong> ${formData.demoType}</p>
          <p><strong>Platform:</strong> ${formData.platform}</p>
          
          <h3>Demo Details</h3>
          <p><strong>Main Service:</strong> ${formData.mainService}</p>
          <p><strong>Sub-Services Selected:</strong> ${formData.subServices.length > 0 ? formData.subServices.join(', ') : 'None selected'}</p>
          
          <h3>Project Information</h3>
          <p><strong>Current Challenges:</strong> ${formData.currentChallenges || 'Not provided'}</p>
          <p><strong>Demo Goals:</strong> ${formData.demoGoals || 'Not provided'}</p>
          <p><strong>Special Requirements:</strong> ${formData.specialRequirements || 'No special requirements'}</p>
          
          <h3>Preferences</h3>
          <p><strong>Marketing Consent:</strong> ${formData.marketingConsent ? 'Yes' : 'No'}</p>
          
          <hr>
          <p><em>This message was sent from the Opsora Agency demo booking form.</em></p>
          <p><strong>Client Email for reply:</strong> ${formData.email}</p>
        `,
      };

      // 3. Prepare User Confirmation Email Payload (to user's email)
      const userEmailPayload = {
        to: formData.email,
        subject: `✅ Demo Request Received: ${demoId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px; background-color: #000000; padding: 20px; border-radius: 10px 10px 0 0;">
  <img 
    src="https://opsoraagency.vercel.app/images/logo/logo.svg" 
    alt="Opsora Agency" 
    style="height: 50px; width: auto; display: block; margin: 0 auto;"
  />
  <h2 style="color: white; margin: 15px 0 0 0;">Demo Request Received</h2>
</div>
            
            <p style="color: #333; margin-bottom: 20px;">Dear ${formData.name},</p>
            <p style="color: #666; margin-bottom: 20px;">Thank you for booking a demo with Opsora Agency. We're excited to show you how our solutions can help your business.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 16px; color: #333;"><strong>Your Demo ID:</strong></p>
              <p style="font-size: 24px; font-weight: bold; color: #1e40af; margin: 10px 0;">${demoId}</p>
            </div>
            
            <h3 style="color: #333;">Demo Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.demoDate || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.demoTime || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Service:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.mainService}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Demo Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.demoType === 'online' ? 'Online (Video Call)' : 'In-Person (Ahmedabad)'}</td>
              </tr>
            </table>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #333; margin: 0;"><strong>⏰ What's Next:</strong></p>
              <ul style="color: #666; margin: 10px 0 0 20px; padding-left: 0;">
                <li>You'll receive a calendar invitation within 2 hours</li>
                <li>Our expert will prepare a personalized demo based on your requirements</li>
                <li>A reminder will be sent 24 hours before the demo</li>
                <li>We'll contact you via your preferred method: <strong>${formData.preferredContact}</strong></li>
              </ul>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px;">
              <p style="color: #333; margin: 0;"><strong>📝 Your Demo Focus:</strong></p>
              <p style="color: #666; margin: 5px 0 0 0;"><em>Current Challenges:</em> ${formData.currentChallenges}</p>
              <p style="color: #666; margin: 5px 0 0 0;"><em>Demo Goals:</em> ${formData.demoGoals}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #888; font-size: 12px; text-align: center;">
              Need to reschedule? Email us at <a href="mailto:opsoraagency@gmail.com" style="color: #1e40af;">opsoraagency@gmail.com</a><br>
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
        fetch('/api/store-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(storagePayload),
        })
      ]);

      // 5. Handle results
      let successMessage = '';
      let errorMessage = '';
      
      // Check admin email response
      if (adminEmailRes.status === 'fulfilled' && adminEmailRes.value.ok) {
        successMessage = '✅ Email sent successfully.';
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
      }
      
      // Set final message
      if (successMessage.includes('✅')) {
        let message = `Thank you! Your demo request has been submitted successfully. Demo ID: ${demoId}. We will send you a calendar invitation within 2 hours.`;
        
        // Add confirmation about user email if sent
        if (userEmailRes.status === 'fulfilled' && userEmailRes.value.ok) {
          message = `✅ Thank you! Your demo request has been submitted successfully. Demo ID: ${demoId}. A confirmation email has been sent to ${formData.email}. We will send you a calendar invitation within 2 hours.`;
        }
        
        setSubmitMessage(message);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          jobTitle: '',
          industry: '',
          otherIndustry: '',
          mainService: '',
          subServices: [],
          demoDate: '',
          demoTime: '',
          timezone: 'IST',
          attendees: '1-2',
          demoType: 'online',
          platform: 'zoom',
          currentChallenges: '',
          demoGoals: '',
          referralSource: '',
          preferredContact: 'email',
          privacyConsent: false,
          marketingConsent: false,
          specialRequirements: '',
        });
      } else {
        setSubmitMessage(`${errorMessage}Please try again or contact us directly at opsoraagency@gmail.com`);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      setSubmitMessage('Network error. Please try again or contact us directly at opsoraagency@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h1 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  Book Your Demo
                </h1>
                
                <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                  <div className="flex flex-wrap items-center">
                    <div className="mb-5 mr-10 flex items-center">
                      <div className="w-full">
                        <span className="mb-1 text-base font-medium text-body-color">
                          Services Demo Consultation
                        </span>
                        <p className="text-sm text-body-color opacity-80">
                          Book a demo to see our services in action
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                      Book Service Demo
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Contact Information</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Business Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                            placeholder="john@company.com"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                            placeholder="Your Company Inc."
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Job Title/Role
                          </label>
                          <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                            placeholder="CEO, Marketing Manager, etc."
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Industry *
                          </label>
                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          >
                            <option value="">Select industry...</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="Technology/SaaS">Technology/SaaS</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Education">Education</option>
                            <option value="Finance/Fintech">Finance/Fintech</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Retail">Retail</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Hospitality">Hospitality</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Other Industry Input - Only show if "Other" is selected */}
                      {formData.industry === 'Other' && (
                        <div className="mt-4">
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Please specify your industry *
                          </label>
                          <input
                            type="text"
                            name="otherIndustry"
                            value={formData.otherIndustry}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                            placeholder="Enter your industry name..."
                          />
                        </div>
                      )}
                      
                      {/* Referral Source */}
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-body-color">
                          How did you hear about us?
                        </label>
                        <select
                          name="referralSource"
                          value={formData.referralSource}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                        >
                          <option value="">Select option...</option>
                          <option value="Google Search">Google Search</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Referral">Referral</option>
                          <option value="Previous Client">Previous Client</option>
                          <option value="Advertisement">Advertisement</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      {/* Preferred Contact Method */}
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-body-color">
                          Preferred Contact Method *
                        </label>
                        <div className="flex flex-wrap gap-4">
                          {['email', 'phone', 'whatsapp'].map((method) => (
                            <div key={method} className="flex items-center">
                              <input
                                type="radio"
                                id={`contact-${method}`}
                                name="preferredContact"
                                value={method}
                                checked={formData.preferredContact === method}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-primary focus:ring-primary"
                                required
                              />
                              <label htmlFor={`contact-${method}`} className="ml-2 text-sm text-body-color capitalize">
                                {method === 'whatsapp' ? 'WhatsApp' : method}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Demo Schedule */}
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Demo Schedule</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Preferred Demo Date *
                          </label>
                          <input
                            type="date"
                            name="demoDate"
                            value={formData.demoDate}
                            onChange={handleInputChange}
                            min={minDate}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          />
                          <p className="mt-1 text-xs text-body-color opacity-70">Earliest available: Tomorrow</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Preferred Time Slot *
                          </label>
                          <select
                            name="demoTime"
                            value={formData.demoTime}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          >
                            <option value="">Select time slot...</option>
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>{slot} (IST)</option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-body-color opacity-70">All times in India Standard Time</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Timezone *
                          </label>
                          <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          >
                            <option value="IST">India Standard Time (IST)</option>
                            <option value="EST">Eastern Standard Time (EST)</option>
                            <option value="PST">Pacific Standard Time (PST)</option>
                            <option value="GMT">Greenwich Mean Time (GMT)</option>
                            <option value="CET">Central European Time (CET)</option>
                            <option value="AEST">Australian Eastern Time (AEST)</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Number of Attendees *
                          </label>
                          <select
                            name="attendees"
                            value={formData.attendees}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          >
                            <option value="1-2">1-2 People</option>
                            <option value="3-5">3-5 People</option>
                            <option value="6-10">6-10 People</option>
                            <option value="10+">10+ People</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Demo Type *
                          </label>
                          <select
                            name="demoType"
                            value={formData.demoType}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          >
                            <option value="online">Online (Video Call)</option>
                            <option value="in-person">In-Person (Ahmedabad)</option>
                          </select>
                        </div>
                        {formData.demoType === 'online' && (
                          <div>
                            <label className="mb-2 block text-sm font-medium text-body-color">
                              Preferred Platform *
                            </label>
                            <select
                              name="platform"
                              value={formData.platform}
                              onChange={handleInputChange}
                              required
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                            >
                              <option value="zoom">Zoom</option>
                              <option value="google-meet">Google Meet</option>
                              <option value="microsoft-teams">Microsoft Teams</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Demo Focus</h3>
                      
                      {/* Main Service Dropdown */}
                      <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-body-color">
                          Choose Service for Demo *
                        </label>
                        <select
                          name="mainService"
                          value={formData.mainService}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                        >
                          <option value="">Select a service for demo...</option>
                          <option value="Digital Marketing Service">Digital Marketing Service</option>
                          <option value="Automation / AI-Agents">Automation / AI-Agents</option>
                          <option value="Website Development Service">Website Development Service</option>
                        </select>
                      </div>

                      {/* Sub Services - Only show if main service has sub-services */}
                      {formData.mainService && services[formData.mainService as keyof typeof services]?.length > 0 && (
                        <div className="mb-6">
                          <label className="mb-3 block text-sm font-medium text-body-color">
                            Select Specific Areas to Demo (Multiple choices allowed)
                          </label>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {services[formData.mainService as keyof typeof services].map((service) => (
                              <div key={service} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={service}
                                  checked={formData.subServices.includes(service)}
                                  onChange={() => handleCheckboxChange(service)}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor={service} className="ml-3 text-sm text-body-color">
                                  {service}
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-body-color opacity-70">
                            {formData.subServices.length} of {services[formData.mainService as keyof typeof services]?.length} selected
                          </p>
                        </div>
                      )}

                      {/* Note for Website Development */}
                      {formData.mainService === 'Website Development Service' && (
                        <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> Website Development Service demo includes complete package overview: Design, Development, Hosting, SSL, SEO, and Maintenance.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Demo Details */}
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Demo Preparation</h3>
                      
                      {/* Current Challenges */}
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-body-color">
                          Current Challenges/Pain Points *
                        </label>
                        <textarea
                          name="currentChallenges"
                          value={formData.currentChallenges}
                          onChange={handleInputChange}
                          rows={3}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          placeholder="What challenges are you currently facing that you want us to address in the demo?"
                        />
                      </div>
                      
                      {/* Demo Goals */}
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-body-color">
                          Demo Goals/Objectives *
                        </label>
                        <textarea
                          name="demoGoals"
                          value={formData.demoGoals}
                          onChange={handleInputChange}
                          rows={3}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          placeholder="What specific outcomes do you expect from this demo?"
                        />
                      </div>
                      
                      {/* Special Requirements */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-body-color">
                          Special Requirements/Accommodations
                        </label>
                        <textarea
                          name="specialRequirements"
                          value={formData.specialRequirements}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          placeholder="Any specific tools/technologies to cover, preferred language, accessibility needs, etc."
                        />
                      </div>
                    </div>

                    {/* Consent Section */}
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="privacyConsent"
                            name="privacyConsent"
                            checked={formData.privacyConsent}
                            onChange={handleInputChange}
                            required
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="privacyConsent" className="ml-3 text-sm text-body-color">
                            I agree to the <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> *
                          </label>
                        </div>
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="marketingConsent"
                            name="marketingConsent"
                            checked={formData.marketingConsent}
                            onChange={handleInputChange}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="marketingConsent" className="ml-3 text-sm text-body-color">
                            I would like to receive marketing emails about services, promotions, and updates
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button & Message */}
                    <div className="pt-4">
                      {submitMessage && (
                        <div className={`mb-4 rounded-lg p-4 ${submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
                          {submitMessage}
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-primary px-8 py-4 text-base font-semibold text-white duration-300 hover:bg-primary/90 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Book Free Demo'}
                      </button>
                      
                      <p className="mt-3 text-center text-sm text-body-color opacity-70">
                        By submitting this form, you agree to our Privacy Policy. We'll contact you within 2 hours to confirm your demo schedule.
                      </p>
                    </div>
                  </form>
                </div>

                {/* Demo Information */}
                <div className="mt-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white">What to Expect in Your Free Demo</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-primary">📅</span>
                      </div>
                      <h4 className="mb-2 font-semibold text-black dark:text-white">Quick Scheduling</h4>
                      <p className="text-sm text-body-color">Book your preferred date and time. Get calendar invitation within 2 hours.</p>
                    </div>
                    <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-primary">🎯</span>
                      </div>
                      <h4 className="mb-2 font-semibold text-black dark:text-white">Personalized Demo</h4>
                      <p className="text-sm text-body-color">60-minute customized demo based on your specific requirements.</p>
                    </div>
                    <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-primary">💡</span>
                      </div>
                      <h4 className="mb-2 font-semibold text-black dark:text-white">Expert Consultation</h4>
                      <p className="text-sm text-body-color">Q&A session with our experts to address your specific challenges.</p>
                    </div>
                  </div>
                </div>

                {/* Alternative Contact */}
                <div className="mt-8 text-center">
                  <p className="text-body-color">
                    Need immediate assistance? Email us at{' '}
                    <a href="mailto:opsoraagency@gmail.com" className="text-primary hover:underline">
                      opsoraagency@gmail.com
                    </a>
                    {' '}or call{' '}
                    <a href="tel:+918401765505" className="text-primary hover:underline">
                      +91 8401765505
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DemoBookingPage;
