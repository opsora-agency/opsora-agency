'use client';

import { useState, useEffect } from 'react';

type ServiceType = 'digital_marketing' | 'automation' | 'website_development';
type BookingStep = 'select_service' | 'collect_details' | 'demo_schedule' | 'confirm_booking';

interface ChatbotDemoBookingFormProps {
  step: BookingStep;
  bookingData: any;
  onServiceSelect: (service: ServiceType) => void;
  onDetailsSubmit: (details: any) => void;
  onScheduleSubmit: (schedule: any) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  theme: 'light' | 'dark';
}

export default function ChatbotDemoBookingForm({
  step,
  bookingData,
  onServiceSelect,
  onDetailsSubmit,
  onScheduleSubmit,
  onConfirm,
  onCancel,
  loading,
  theme
}: ChatbotDemoBookingFormProps) {
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    otherIndustry: '',
    referralSource: '',
    preferredContact: 'email' as 'email' | 'phone' | 'whatsapp',
  });

  const [schedule, setSchedule] = useState({
    demoDate: '',
    demoTime: '',
    timezone: 'IST',
    attendees: '1-2',
    demoType: 'online' as 'online' | 'in-person',
    platform: 'zoom',
    currentChallenges: '',
    demoGoals: '',
    subServices: [] as string[],
    specialRequirements: '',
  });

  const [formValid, setFormValid] = useState(false);

  // Service options for step 1
  const serviceOptions = [
    { 
      id: 'digital_marketing', 
      name: '📈 Digital Marketing Demo', 
      desc: 'SEO Strategy, Google Ads, Social Media, Content Marketing, Complete Funnel Demo' 
    },
    { 
      id: 'automation', 
      name: '⚡ Automation / AI-Agents Demo', 
      desc: 'AI Workflow, Custom Chatbot, Sales AI, Support AI, Complete AI Solution Demo' 
    },
    { 
      id: 'website_development', 
      name: '🌐 Website Development Demo', 
      desc: 'Complete package overview: Design, Development, Hosting, SSL, SEO, Maintenance' 
    }
  ];

  // Sub-services data
  const subServicesData = {
    'digital_marketing': [
      'SEO Strategy & Audit Demo',
      'Google Ads (PPC) Demo',
      'Social Media Marketing Demo',
      'Content Marketing Demo',
      'Complete Digital Marketing Funnel Demo',
    ],
    'automation': [
      'AI Workflow Automation Demo',
      'Custom AI Chatbot Demo',
      'Sales AI Agent Demo',
      'Support AI Agent Demo',
      'Complete AI Solution Demo',
    ],
    'website_development': [], // No sub-services
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

  // Industry options
  const industries = [
    'E-commerce',
    'Technology/SaaS',
    'Healthcare',
    'Education',
    'Finance/Fintech',
    'Real Estate',
    'Retail',
    'Manufacturing',
    'Hospitality',
    'Other'
  ];

  // Timezone options
  const timezones = [
    'IST',
    'EST',
    'PST',
    'GMT',
    'CET',
    'AEST'
  ];

  // Attendee options
  const attendeeOptions = [
    '1-2',
    '3-5',
    '6-10',
    '10+'
  ];

  // Platform options
  const platformOptions = [
    'zoom',
    'google-meet',
    'microsoft-teams',
    'other'
  ];

  // Referral source options
  const referralSources = [
    'Google Search',
    'Social Media',
    'Referral',
    'Previous Client',
    'Advertisement',
    'Other'
  ];

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get service name for display
  const getServiceName = (serviceId: ServiceType) => {
    const service = serviceOptions.find(s => s.id === serviceId);
    return service ? service.name.split(' ').slice(1).join(' ') : '';
  };

  // Get main service name from ID
  const getMainServiceName = (serviceId: ServiceType) => {
    switch (serviceId) {
      case 'digital_marketing': return 'Digital Marketing Service';
      case 'automation': return 'Automation / AI-Agents';
      case 'website_development': return 'Website Development Service';
      default: return '';
    }
  };

  // Validate details form
  useEffect(() => {
    const isValid = 
      details.name.trim() !== '' &&
      details.email.includes('@') &&
      details.email.includes('.') &&
      details.phone.trim() !== '' &&
      details.company.trim() !== '';
    setFormValid(isValid);
  }, [details]);

  // Validate schedule form
  useEffect(() => {
    const scheduleValid = 
      schedule.demoDate !== '' &&
      schedule.demoTime !== '' &&
      schedule.currentChallenges.trim() !== '' &&
      schedule.demoGoals.trim() !== '';
    setFormValid(scheduleValid);
  }, [schedule]);

  // Handle details change
  const handleDetailChange = (field: string, value: string | boolean) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handle schedule change
  const handleScheduleChange = (field: string, value: string | string[] | boolean) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  // Handle checkbox for sub-services
  const handleSubServiceToggle = (service: string) => {
    setSchedule(prev => {
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

  // Handle submit details
  const handleSubmitDetails = () => {
    if (formValid) {
      onDetailsSubmit(details);
    }
  };

  // Handle submit schedule
  const handleSubmitSchedule = () => {
    if (formValid) {
      onScheduleSubmit(schedule);
    }
  };

  return (
    <div className="booking-form-container">
      {/* Step 1: Select Service */}
      {step === 'select_service' && (
        <div className={`booking-step service-selection ${theme}`}>
          <div className="booking-form-header">
            <h4>Select Demo Type</h4>
            <p>Choose which service you want to see in action:</p>
          </div>
          
          <div className="service-options">
            {serviceOptions.map((service) => (
              <button
                key={service.id}
                onClick={() => onServiceSelect(service.id as ServiceType)}
                className={`service-option ${theme}`}
              >
                <div className="service-icon">{service.name.split(' ')[0]}</div>
                <div className="service-info">
                  <div className="service-name">{service.name.split(' ').slice(1).join(' ')}</div>
                  <div className="service-desc">{service.desc}</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="booking-form-actions">
            <button onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      {/* Step 2: Collect Details */}
      {step === 'collect_details' && (
        <div className={`booking-step details-form ${theme}`}>
          <div className="booking-form-header">
            <h4>Your Details</h4>
            <p>Please provide your contact information:</p>
          </div>
          
          <div className="form-fields">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={details.name}
                onChange={(e) => handleDetailChange('name', e.target.value)}
                placeholder="John Doe"
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Business Email *</label>
              <input
                type="email"
                value={details.email}
                onChange={(e) => handleDetailChange('email', e.target.value)}
                placeholder="john@company.com"
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={details.phone}
                onChange={(e) => handleDetailChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                value={details.company}
                onChange={(e) => handleDetailChange('company', e.target.value)}
                placeholder="Your Company Inc."
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Job Title/Role</label>
              <input
                type="text"
                value={details.jobTitle}
                onChange={(e) => handleDetailChange('jobTitle', e.target.value)}
                placeholder="CEO, Marketing Manager, etc."
                className={theme}
              />
            </div>
            
            <div className="form-group">
              <label>Industry *</label>
              <select
                value={details.industry}
                onChange={(e) => handleDetailChange('industry', e.target.value)}
                className={theme}
                required
              >
                <option value="">Select industry...</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            
            {details.industry === 'Other' && (
              <div className="form-group">
                <label>Please specify your industry *</label>
                <input
                  type="text"
                  value={details.otherIndustry}
                  onChange={(e) => handleDetailChange('otherIndustry', e.target.value)}
                  placeholder="Enter your industry name..."
                  className={theme}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label>How did you hear about us?</label>
              <select
                value={details.referralSource}
                onChange={(e) => handleDetailChange('referralSource', e.target.value)}
                className={theme}
              >
                <option value="">Select option...</option>
                {referralSources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Preferred Contact Method *</label>
              <div className="flex flex-wrap gap-3">
                {(['email', 'phone', 'whatsapp'] as const).map((method) => (
                  <div key={method} className="flex items-center">
                    <input
                      type="radio"
                      id={`contact-${method}`}
                      name="preferredContact"
                      value={method}
                      checked={details.preferredContact === method}
                      onChange={(e) => handleDetailChange('preferredContact', e.target.value)}
                      className="h-4 w-4"
                      required
                    />
                    <label htmlFor={`contact-${method}`} className="ml-2 text-sm capitalize">
                      {method === 'whatsapp' ? 'WhatsApp' : method}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="booking-form-actions">
            <button onClick={onCancel} className="cancel-btn">Back</button>
            <button 
              onClick={handleSubmitDetails} 
              disabled={!formValid || loading}
              className="continue-btn"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Demo Schedule */}
      {step === 'demo_schedule' && (
        <div className={`booking-step schedule-form ${theme}`}>
          <div className="booking-form-header">
            <h4>Demo Schedule</h4>
            <p>Choose your preferred demo date, time, and details:</p>
          </div>
          
          <div className="form-fields">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label>Preferred Demo Date *</label>
                <input
                  type="date"
                  value={schedule.demoDate}
                  onChange={(e) => handleScheduleChange('demoDate', e.target.value)}
                  min={minDate}
                  className={theme}
                  required
                />
                <p className="mt-1 text-xs opacity-70">Earliest available: Tomorrow</p>
              </div>
              
              <div className="form-group">
                <label>Preferred Time Slot *</label>
                <select
                  value={schedule.demoTime}
                  onChange={(e) => handleScheduleChange('demoTime', e.target.value)}
                  className={theme}
                  required
                >
                  <option value="">Select time slot...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot} (IST)</option>
                  ))}
                </select>
                <p className="mt-1 text-xs opacity-70">All times in India Standard Time</p>
              </div>
              
              <div className="form-group">
                <label>Timezone *</label>
                <select
                  value={schedule.timezone}
                  onChange={(e) => handleScheduleChange('timezone', e.target.value)}
                  className={theme}
                  required
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Number of Attendees *</label>
                <select
                  value={schedule.attendees}
                  onChange={(e) => handleScheduleChange('attendees', e.target.value)}
                  className={theme}
                  required
                >
                  {attendeeOptions.map((option) => (
                    <option key={option} value={option}>{option} People</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Demo Type *</label>
                <select
                  value={schedule.demoType}
                  onChange={(e) => handleScheduleChange('demoType', e.target.value)}
                  className={theme}
                  required
                >
                  <option value="online">Online (Video Call)</option>
                  <option value="in-person">In-Person (Ahmedabad)</option>
                </select>
              </div>
              
              {schedule.demoType === 'online' && (
                <div className="form-group">
                  <label>Preferred Platform *</label>
                  <select
                    value={schedule.platform}
                    onChange={(e) => handleScheduleChange('platform', e.target.value)}
                    className={theme}
                    required
                  >
                    {platformOptions.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform === 'google-meet' ? 'Google Meet' : 
                         platform === 'microsoft-teams' ? 'Microsoft Teams' : 
                         platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {/* Sub-services selection - only show if service has sub-services */}
            {(() => {
              const subServices = subServicesData[bookingData.service as keyof typeof subServicesData];
              
              if (subServices && subServices.length > 0) {
                return (
                  <div className="form-group">
                    <label>Select Specific Areas to Demo (Optional)</label>
                    <div className="space-y-2">
                      {subServices.map((subService) => (
                        <div key={subService} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`sub-${subService}`}
                            checked={schedule.subServices.includes(subService)}
                            onChange={() => handleSubServiceToggle(subService)}
                            className="h-4 w-4"
                          />
                          <label htmlFor={`sub-${subService}`} className="ml-2 text-sm">
                            {subService}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              
              if (bookingData.service === 'website_development') {
                return (
                  <div className={`rounded-lg p-3 ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                    <p className={`text-sm ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
                      <strong>Note:</strong> Website Development Service demo includes complete package overview: Design, Development, Hosting, SSL, SEO, and Maintenance.
                    </p>
                  </div>
                );
              }
              
              return null;
            })()}
            
            <div className="form-group">
              <label>Current Challenges/Pain Points *</label>
              <textarea
                value={schedule.currentChallenges}
                onChange={(e) => handleScheduleChange('currentChallenges', e.target.value)}
                rows={3}
                placeholder="What challenges are you currently facing that you want us to address in the demo?"
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Demo Goals/Objectives *</label>
              <textarea
                value={schedule.demoGoals}
                onChange={(e) => handleScheduleChange('demoGoals', e.target.value)}
                rows={3}
                placeholder="What specific outcomes do you expect from this demo?"
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Special Requirements/Accommodations</label>
              <textarea
                value={schedule.specialRequirements}
                onChange={(e) => handleScheduleChange('specialRequirements', e.target.value)}
                rows={2}
                placeholder="Any specific tools/technologies to cover, preferred language, accessibility needs, etc."
                className={theme}
              />
            </div>
          </div>
          
          <div className="booking-form-actions">
            <button onClick={() => onDetailsSubmit(details)} className="cancel-btn">
              Back
            </button>
            <button 
              onClick={handleSubmitSchedule} 
              disabled={!formValid || loading}
              className="continue-btn"
            >
              {loading ? 'Saving...' : 'Review Booking'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm Booking */}
      {step === 'confirm_booking' && (
        <div className={`booking-step confirmation ${theme}`}>
          <div className="booking-form-header">
            <h4>Review Demo Booking</h4>
            <p>Please review your demo booking details:</p>
          </div>
          
          <div className="booking-summary">
            <div className="summary-section">
              <h5>Demo Details:</h5>
              <p><strong>Service:</strong> {getServiceName(bookingData.service)}</p>
              {schedule.subServices.length > 0 && (
                <p className="text-sm mt-1">
                  <strong>Focus Areas:</strong> {schedule.subServices.join(', ')}
                </p>
              )}
              <p><strong>Date:</strong> {schedule.demoDate}</p>
              <p><strong>Time:</strong> {schedule.demoTime} ({schedule.timezone})</p>
              <p><strong>Attendees:</strong> {schedule.attendees} People</p>
              <p><strong>Type:</strong> {schedule.demoType === 'online' ? 'Online' : 'In-Person (Ahmedabad)'}</p>
              {schedule.demoType === 'online' && (
                <p><strong>Platform:</strong> {
                  schedule.platform === 'google-meet' ? 'Google Meet' : 
                  schedule.platform === 'microsoft-teams' ? 'Microsoft Teams' : 
                  schedule.platform.charAt(0).toUpperCase() + schedule.platform.slice(1)
                }</p>
              )}
            </div>
            
            <div className="summary-section">
              <h5>Personal Details:</h5>
              <p><strong>Name:</strong> {bookingData.name}</p>
              <p><strong>Email:</strong> {bookingData.email}</p>
              <p><strong>Phone:</strong> {bookingData.phone}</p>
              <p><strong>Company:</strong> {bookingData.company}</p>
              {bookingData.jobTitle && <p><strong>Job Title:</strong> {bookingData.jobTitle}</p>}
              <p><strong>Industry:</strong> {bookingData.industry === 'Other' ? bookingData.otherIndustry : bookingData.industry}</p>
              <p><strong>Preferred Contact:</strong> {bookingData.preferredContact}</p>
            </div>
            
            <div className="summary-section">
              <h5>Demo Preparation:</h5>
              <p><strong>Current Challenges:</strong> {schedule.currentChallenges}</p>
              <p><strong>Demo Goals:</strong> {schedule.demoGoals}</p>
              {schedule.specialRequirements && (
                <p><strong>Special Requirements:</strong> {schedule.specialRequirements}</p>
              )}
            </div>
          </div>
          
          <div className="confirmation-note">
            <p>✅ Calendar invitation will be sent to <strong>{bookingData.email}</strong></p>
            <p>📞 Our team will confirm your demo within 2 hours</p>
            <p className="text-xs mt-2">
              By confirming, you agree to our Privacy Policy and Terms of Service
            </p>
          </div>
          
          <div className="booking-form-actions">
            <button onClick={() => onScheduleSubmit(schedule)} className="cancel-btn">
              Edit Booking
            </button>
            <button 
              onClick={onConfirm} 
              disabled={loading}
              className="confirm-btn"
            >
              {loading ? (
                <>
                  <div className="booking-spinner"></div>
                  Processing...
                </>
              ) : 'Confirm Demo Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}