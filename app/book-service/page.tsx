'use client';

import { useState, FormEvent } from 'react';

const BookServicePage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    otherIndustry: '',
    budget: '',
    timeline: '',
    requirements: '',
    mainService: '',
    subServices: [] as string[],
    currentChallenges: '',
    projectGoals: '',
    referralSource: '',
    preferredContact: 'email',
    privacyConsent: false,
    marketingConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Services data
  const services = {
    'Digital Marketing Service': [
      'SEO Optimization',
      'PPC Campaigns (Google Ads)',
      'Social Media Marketing',
      'Content Marketing',
      'Email Marketing',
      'Analytics & Reporting',
    ],
    'Automation Service': [
      'AI Workflow Automation',
      'AI-Powered Chatbots',
      'Sales AI Agents',
      'Support AI Agents',
      'Custom AI Agent Development',
    ],
    'Website Development Service': [], // No sub-services
  };

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

    // Generate a unique Service Booking ID
    const bookingId = 'SER-' + Math.floor(100000 + Math.random() * 900000);

    try {
      console.log('Submitting form data:', formData);
      
      // 1. Prepare Admin Email Payload (to opsoraagency@gmail.com)
      const adminEmailPayload = {
        to: 'opsoraagency@gmail.com',
        subject: `[${bookingId}] New Service Booking: ${formData.mainService}`,
        html: `
          <h2>New Service Booking Request</h2>
          <h3>Booking ID: ${bookingId}</h3>
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
          <p><strong>Job Title:</strong> ${formData.jobTitle || 'Not provided'}</p>
          <p><strong>Industry:</strong> ${formData.industry === 'Other' ? formData.otherIndustry : formData.industry || 'Not specified'}</p>
          <p><strong>How did you hear about us?</strong> ${formData.referralSource || 'Not specified'}</p>
          <p><strong>Preferred Contact:</strong> ${formData.preferredContact}</p>
          
          <h3>Service Details</h3>
          <p><strong>Main Service:</strong> ${formData.mainService}</p>
          <p><strong>Sub-Services Selected:</strong> ${formData.subServices.length > 0 ? formData.subServices.join(', ') : 'None selected'}</p>
          <p><strong>Budget:</strong> ${formData.budget || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${formData.timeline || 'Not specified'}</p>
          
          <h3>Project Information</h3>
          <p><strong>Current Challenges:</strong> ${formData.currentChallenges || 'Not provided'}</p>
          <p><strong>Project Goals:</strong> ${formData.projectGoals || 'Not provided'}</p>
          <p><strong>Requirements:</strong> ${formData.requirements || 'No additional requirements provided'}</p>
          
          <h3>Preferences</h3>
          <p><strong>Marketing Consent:</strong> ${formData.marketingConsent ? 'Yes' : 'No'}</p>
          
          <hr>
          <p><em>This message was sent from the Opsora Agency booking form.</em></p>
          <p><strong>Client Email for reply:</strong> ${formData.email}</p>
        `,
      };

      // 2. Prepare User Confirmation Email Payload (to user's email)
      const userEmailPayload = {
        to: formData.email,
        subject: `✅ Service Booking Request Received: ${bookingId}`,
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
            <p style="color: #666; margin-bottom: 20px;">Thank you for your interest in Opsora Agency's services. Your booking request has been received successfully.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 16px; color: #333;"><strong>Your Booking ID:</strong></p>
              <p style="font-size: 24px; font-weight: bold; color: #1e40af; margin: 10px 0;">${bookingId}</p>
            </div>
            
            <h3 style="color: #333;">Request Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Service:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.mainService}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Budget Range:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.budget || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Timeline:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.timeline || 'Not specified'}</td>
              </tr>
            </table>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #333; margin: 0;"><strong>📅 What's Next:</strong></p>
              <ul style="color: #666; margin: 10px 0 0 20px; padding-left: 0;">
                <li>Our team will review your requirements within 24 hours</li>
                <li>We'll contact you via your preferred method: <strong>${formData.preferredContact}</strong></li>
                <li>We'll schedule a consultation to discuss your project in detail</li>
              </ul>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px;">
              <p style="color: #333; margin: 0;"><strong>📝 Your Project Summary:</strong></p>
              <p style="color: #666; margin: 10px 0 0 0;"><em>Current Challenges:</em> ${formData.currentChallenges}</p>
              <p style="color: #666; margin: 5px 0 0 0;"><em>Project Goals:</em> ${formData.projectGoals}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #888; font-size: 12px; text-align: center;">
              Have questions? Email us at <a href="mailto:opsoraagency@gmail.com" style="color: #1e40af;">opsoraagency@gmail.com</a><br>
              &copy; ${new Date().getFullYear()} Opsora Agency. All rights reserved.
            </p>
          </div>
        `,
      };

      // 3. Prepare storage payload for Google Sheets
      const storagePayload = {
        bookingId: bookingId,
        customerName: formData.name,
        customerEmail: formData.email,
        contactPhone: formData.phone,
        businessName: formData.company,
        positionTitle: formData.jobTitle,
        industryType: formData.industry === 'Other' ? formData.otherIndustry : formData.industry,
        budgetRange: formData.budget,
        timelinePreference: formData.timeline,
        mainService: formData.mainService,
        selectedServices: formData.subServices,
        currentProblems: formData.currentChallenges,
        projectAims: formData.projectGoals,
        additionalNotes: formData.requirements,
        howFoundUs: formData.referralSource,
        contactPreference: formData.preferredContact,
        marketingAgreement: formData.marketingConsent
      };

      // 4. Run operations (Admin Email + User Email + Sheet)
      const [adminEmailRes, userEmailRes, storageRes] = await Promise.allSettled([
        // Send admin email
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminEmailPayload),
        }),
        
        // Send user confirmation email
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userEmailPayload),
        }),
        
        // Save to Google Sheets
        fetch('/api/store-service', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(storagePayload),
        })
      ]);

      // 5. Check results
      let emailSuccess = false;
      let storageSuccess = false;
      let emailError = '';
      let storageError = '';
      
      // Check admin email response
      if (adminEmailRes.status === 'fulfilled') {
        const adminEmailResult = adminEmailRes.value;
        if (adminEmailResult.ok) {
          emailSuccess = true;
          const emailData = await adminEmailResult.json();
          console.log('Admin email sent successfully:', emailData);
        } else {
          const errorData = await adminEmailResult.json();
          emailError = errorData.error || 'Email sending failed';
          console.error('Admin email failed:', emailError);
        }
      } else {
        emailError = 'Email request failed';
        console.error('Email request failed:', adminEmailRes.reason);
      }
      
      // Check user email response (log but don't affect main success)
      if (userEmailRes.status === 'fulfilled') {
        const userEmailResult = userEmailRes.value;
        if (userEmailResult.ok) {
          console.log('User confirmation email sent successfully');
        } else {
          console.error('User email failed but form still submitted');
        }
      }
      
      // Check storage response
      if (storageRes.status === 'fulfilled') {
        const storageResult = storageRes.value;
        if (storageResult.ok) {
          const storageData = await storageResult.json();
          storageSuccess = storageData.stored;
          console.log('Storage successful:', storageData);
        } else {
          const errorData = await storageResult.json();
          storageError = errorData.error || 'Storage failed';
          console.error('Storage failed:', storageError);
        }
      } else {
        storageError = 'Storage request failed';
        console.error('Storage request failed:', storageRes.reason);
      }

      // 6. Handle response based on results
      if (emailSuccess) {
        // Email was successful
        let message = `✅ Thank you! Your service request has been submitted. Booking ID: ${bookingId}. We will contact you within 24 hours.`;
        
        // Add confirmation about user email if sent
        if (userEmailRes.status === 'fulfilled' && userEmailRes.value.ok) {
          message = `✅ Thank you! Your service request has been submitted. Booking ID: ${bookingId}. A confirmation email has been sent to ${formData.email}. We will contact you within 24 hours.`;
        }
        
        if (storageSuccess) {
          setSubmitMessage(message);
        } else {
          // Storage failed but email succeeded
          setSubmitMessage(message);
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          jobTitle: '',
          industry: '',
          otherIndustry: '',
          budget: '',
          timeline: '',
          requirements: '',
          mainService: '',
          subServices: [],
          currentChallenges: '',
          projectGoals: '',
          referralSource: '',
          preferredContact: 'email',
          privacyConsent: false,
          marketingConsent: false,
        });
        
      } else {
        // Email failed
        const errorMsg = emailError || 'Something went wrong. Please try again or contact us directly at opsoraagency@gmail.com';
        setSubmitMessage(`Error: ${errorMsg}`);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      setSubmitMessage('Network error. Please try again or contact us directly at opsoraagency@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h1 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  Book Service
                </h1>
                
                <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                  <div className="flex flex-wrap items-center">
                    <div className="mb-5 mr-10 flex items-center">
                      <div className="w-full">
                        <span className="mb-1 text-base font-medium text-body-color">
                          Get a Custom Quote
                        </span>
                        <p className="text-sm text-body-color opacity-80">
                          Fill out the form below and we'll contact you within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                      Book Now
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

                    {/* Service Selection */}
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Service Selection</h3>
                      
                      {/* Main Service Dropdown */}
                      <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-body-color">
                          Choose Main Service *
                        </label>
                        <select
                          name="mainService"
                          value={formData.mainService}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                        >
                          <option value="">Select a service...</option>
                          <option value="Digital Marketing Service">Digital Marketing Service</option>
                          <option value="Automation Service">Automation Service</option>
                          <option value="Website Development Service">Website Development Service</option>
                        </select>
                      </div>

                      {/* Sub Services - Only show if main service has sub-services */}
                      {formData.mainService && services[formData.mainService as keyof typeof services]?.length > 0 && (
                        <div className="mb-6">
                          <label className="mb-3 block text-sm font-medium text-body-color">
                            Select Sub-Services (Multiple choices allowed)
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
                            <strong>Note:</strong> Website Development Service includes complete package: Design, Development, Hosting, SSL, SEO, and Maintenance. No additional sub-services needed.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Project Details</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Estimated Budget *
                          </label>
                          <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          >
                            <option value="">Select budget range...</option>
                            <option value="Under $1,000">Under $1,000</option>
                            <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                            <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                            <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                            <option value="$25,000+">$25,000+</option>
                            <option value="Need consultation">Need consultation</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-body-color">
                            Project Timeline *
                          </label>
                          <select
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          >
                            <option value="">Select timeline...</option>
                            <option value="ASAP (1-2 weeks)">ASAP (1-2 weeks)</option>
                            <option value="1 month">1 month</option>
                            <option value="1-3 months">1-3 months</option>
                            <option value="3-6 months">3-6 months</option>
                            <option value="6+ months">6+ months</option>
                            <option value="Flexible">Flexible</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Current Challenges */}
                      <div className="mt-4">
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
                          placeholder="What challenges are you currently facing that you want us to solve?"
                        />
                      </div>
                      
                      {/* Project Goals */}
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-body-color">
                          Project Goals/Objectives *
                        </label>
                        <textarea
                          name="projectGoals"
                          value={formData.projectGoals}
                          onChange={handleInputChange}
                          rows={3}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                          placeholder="What are your main goals and objectives for this project?"
                        />
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-body-color">
                        Project Requirements & Additional Information
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-body-color focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-900"
                        placeholder="Please describe your project requirements, timeline expectations, and any other relevant information..."
                      />
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
                        {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                      </button>
                      
                      <p className="mt-3 text-center text-sm text-body-color opacity-70">
                        By submitting this form, you agree to our Privacy Policy. We'll contact you within 24 hours.
                      </p>
                    </div>
                  </form>
                </div>

                {/* Alternative Contact */}
                <div className="mt-8 text-center">
                  <p className="text-body-color">
                    Prefer to contact us directly? Email us at{' '}
                    <a href="mailto:opsoraagency@gmail.com" className="text-primary hover:underline">
                      opsoraagency@gmail.com
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

export default BookServicePage;
