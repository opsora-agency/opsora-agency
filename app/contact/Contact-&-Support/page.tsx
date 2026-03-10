'use client';
import { useState, FormEvent } from 'react';

const ContactPage = () => {
  // State for form fields - adding subject field
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission - UPDATED WITH USER EMAIL
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    // Generate a unique Contact ID
    const contactId = 'CT-' + Math.floor(100000 + Math.random() * 900000);

    try {
      // Prepare Admin Email Payload (to opsoraagency@gmail.com)
      const adminEmailPayload = {
        to: 'opsoraagency@gmail.com',
        subject: `[${contactId}] Contact Form: ${formData.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <h3>Contact ID: ${contactId}</h3>
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          
          <h3>Message</h3>
          <p>${formData.message}</p>
          
          <hr>
          <p><em>This message was sent from the Opsora Agency contact form.</em></p>
          <p><strong>Client Email for reply:</strong> ${formData.email}</p>
        `,
      };

      // Prepare User Confirmation Email Payload (to user's email)
      const userEmailPayload = {
        to: formData.email,
        subject: `✅ Message Received: ${formData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af;">Opsora Agency</h1>
              <h2 style="color: #333;">Message Received</h2>
            </div>
            
            <p style="color: #333; margin-bottom: 20px;">Dear ${formData.name},</p>
            <p style="color: #666; margin-bottom: 20px;">Thank you for contacting Opsora Agency. We have received your message and will get back to you within 24 hours.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 16px; color: #333;"><strong>Your Contact ID:</strong></p>
              <p style="font-size: 24px; font-weight: bold; color: #1e40af; margin: 10px 0;">${contactId}</p>
            </div>
            
            <h3 style="color: #333;">Message Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Subject:</strong></td>
                <td style="padding: 8px 0; color: #333;">${formData.subject}</td>
              </tr>
            </table>
            
            <h3 style="color: #333;">Your Message</h3>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #666; margin: 0; white-space: pre-wrap;">${formData.message}</p>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px;">
              <p style="color: #333; margin: 0;"><strong>⏱️ Response Time:</strong> Within 24 hours</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #888; font-size: 12px; text-align: center;">
              For urgent matters, contact us on WhatsApp: +91 8401765505<br>
              &copy; ${new Date().getFullYear()} Opsora Agency. All rights reserved.
            </p>
          </div>
        `,
      };

      // Prepare Storage Payload
      const storagePayload = {
        contactId: contactId,
        customerName: formData.name,
        customerEmail: formData.email,
        inquirySubject: formData.subject,
        messageContent: formData.message,
        formType: 'Standard Contact'
      };

      // Run operations (Admin Email + User Email + Sheet)
      const [adminEmailRes, userEmailRes, storageRes] = await Promise.allSettled([
        fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(adminEmailPayload),
        }),
        fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userEmailPayload),
        }),
        fetch('/api/store-contact', {
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
      
      // Determine final status and message
      if (successMessage.includes('✅')) {
        let message = 'Thank you! Your message has been submitted. We will get back to you within 24 hours.';
        
        // Add confirmation about user email if sent
        if (userEmailRes.status === 'fulfilled' && userEmailRes.value.ok) {
          message = `✅ Thank you! Your message has been submitted. Contact ID: ${contactId}. A confirmation email has been sent to ${formData.email}. We will get back to you within 24 hours.`;
        }
        
        setSubmitStatus('success');
        setSubmitMessage(message);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
          setSubmitMessage('');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(`${errorMessage}Please try again or contact us directly at opsoraagency@gmail.com`);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please try again or contact us directly at opsoraagency@gmail.com');
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
                Get in Touch
              </h1>
              <p className="mx-auto max-w-2xl text-base font-medium text-body-color dark:text-body-color-dark">
                Have questions about our services? We're here to help. Reach out to us 
                and our team will get back to you within 24 hours.
              </p>
            </div>

            {/* Contact Form and Information Section */}
            <div className="-mx-4 mb-16 flex flex-wrap items-stretch">
              {/* Contact Form - Made same height as Contact Information */}
              <div className="mb-8 w-full px-4 lg:mb-0 lg:w-7/12">
                <div className="h-full rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none sm:p-8 lg:p-10">
                  <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:mb-8">
                    Send us a Message
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-6 sm:mb-8">
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

                    <div className="mb-6 sm:mb-8">
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white sm:mb-3">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none sm:px-6 sm:py-3"
                      />
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
                        placeholder="What is this regarding?"
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none sm:px-6 sm:py-3"
                      />
                    </div>

                    <div className="mb-8 sm:mb-10">
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white sm:mb-3">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project or inquiry"
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none sm:px-6 sm:py-3"
                      />
                    </div>


                    {/* Success/Error Message */}
                  {submitMessage && (
                    <div className={`mb-6 rounded border-l-4 p-4 ${
                      submitStatus === 'success' 
                        ? 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                        : 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {submitMessage}
                    </div>
                  )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full rounded-sm bg-primary px-6 py-3 text-base font-medium text-white shadow-submit duration-300 hover:bg-opacity-90 dark:shadow-submit-dark sm:px-9 sm:py-4 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Information Card - Made same height as Contact Form */}
              <div className="w-full px-4 lg:w-5/12">
                <div className="h-full rounded-sm bg-white p-6 shadow-three dark:bg-gray-dark dark:shadow-none sm:p-8 lg:p-10">
                  <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:mb-8">
                    Contact Information
                  </h2>

                  <div className="mb-8 sm:mb-10">
                    <div className="mb-4 flex items-center sm:mb-6">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary bg-opacity-10 sm:mr-6 sm:h-12 sm:w-12">
                        <svg
                          className="h-5 w-5 text-primary sm:h-6 sm:w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="mb-1 text-base font-medium text-dark dark:text-white sm:text-lg">
                          Call Us
                        </h4>
                        <p className="text-sm text-body-color dark:text-body-color-dark sm:text-base">
                          +91 8401765505
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center sm:mb-6">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary bg-opacity-10 sm:mr-6 sm:h-12 sm:w-12">
                        <svg
                          className="h-5 w-5 text-primary sm:h-6 sm:w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="mb-1 text-base font-medium text-dark dark:text-white sm:text-lg">
                          Email Address
                        </h4>
                        <p className="text-sm text-body-color dark:text-body-color-dark sm:text-base">
                          opsoraagency@gmail.com
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 flex items-center sm:mb-8">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary bg-opacity-10 sm:mr-6 sm:h-12 sm:w-12">
                        <svg
                          className="h-5 w-5 text-primary sm:h-6 sm:w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="mb-1 text-base font-medium text-dark dark:text-white sm:text-lg">
                          Our Location
                        </h4>
                        <p className="text-sm text-body-color dark:text-body-color-dark sm:text-base">
                          Anand, Gujarat<br />
                          India
                        </p>
                      </div>
                    </div>

                    {/* WhatsApp Button - Changed to green theme */}
                    <a
                      href="https://wa.me/918401765505?text=Hi%20Opsora%20Agency%2C%20I'm%20interested%20in%20your%20services.%20Can%20you%20please%20share%20more%20details%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-6 flex w-full items-center justify-center rounded-sm bg-green-600 px-4 py-3 text-center text-white duration-300 hover:bg-green-700 sm:px-6 sm:py-4"
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-white sm:h-6 sm:w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.897 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                      </svg>
                      <span className="text-sm font-medium text-white sm:text-base">
                        Chat with us on WhatsApp
                      </span>
                    </a>
                  </div>

                  <div className="border-t border-gray-200 pt-6 dark:border-gray-700 sm:pt-8">
                    <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:mb-6">
                      Business Hours
                    </h3>
                    <div className="mb-8 space-y-3 sm:mb-10 sm:space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-body-color dark:text-body-color-dark sm:text-base">
                          Monday - Friday
                        </span>
                        <span className="text-sm font-medium text-dark dark:text-white sm:text-base">
                          9:00 AM - 6:00 PM
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-body-color dark:text-body-color-dark sm:text-base">
                          Saturday
                        </span>
                        <span className="text-sm font-medium text-dark dark:text-white sm:text-base">
                          10:00 AM - 4:00 PM
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-body-color dark:text-body-color-dark sm:text-base">
                          Sunday
                        </span>
                        <span className="text-sm font-medium text-dark dark:text-white sm:text-base">
                          Closed
                        </span>
                      </div>
                    </div>

                    {/* Social Icons Section */}
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:mb-6">
                        Connect With Us
                      </h3>
                      <div className="flex space-x-4">
                        <a
                          href="https://www.facebook.com/opsora"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f8f8] text-dark hover:bg-primary hover:text-white dark:bg-[#2C303B] dark:text-white dark:hover:bg-primary"
                          aria-label="Facebook"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                        <a
                          href="https://twitter.com/opsora"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f8f8] text-dark hover:bg-primary hover:text-white dark:bg-[#2C303B] dark:text-white dark:hover:bg-primary"
                          aria-label="Twitter"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </a>
                        <a
                          href="https://linkedin.com/company/opsora"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f8f8] text-dark hover:bg-primary hover:text-white dark:bg-[#2C303B] dark:text-white dark:hover:bg-primary"
                          aria-label="LinkedIn"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                        <a
                          href="https://instagram.com/opsora"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f8f8] text-dark hover:bg-primary hover:text-white dark:bg-[#2C303B] dark:text-white dark:hover:bg-primary"
                          aria-label="Instagram"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Page Embedded Map - Anand, Gujarat */}
            <div className="-mx-4">
              <div className="w-full px-4">
                <div className="rounded-sm bg-white p-4 shadow-three dark:bg-gray-dark dark:shadow-none sm:p-6">
                  <h2 className="mb-4 text-2xl font-bold text-black dark:text-white sm:mb-6 sm:text-3xl">
                    Our Location
                  </h2>
                  <p className="mb-6 text-base text-body-color dark:text-body-color-dark sm:mb-8">
                    Visit us at our office in Anand, Gujarat
                  </p>
                  <div className="overflow-hidden rounded-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117348.13234948947!2d72.8884823340745!3d22.560466616393166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4c95448b9f13%3A0x2fc35f5501d82a69!2sAnand%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      width="100%"
                      height="500"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Opsora Agency Location - Anand, Gujarat"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                  <p className="mt-4 text-center text-sm text-body-color dark:text-body-color-dark sm:mt-6 sm:text-base">
                    Anand, Gujarat, India
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

export default ContactPage;
