'use client';

import { useState, useEffect } from 'react';

type ServiceType = 'digital_marketing' | 'automation' | 'website_development';
type BookingStep = 'select_service' | 'collect_details' | 'project_info' | 'confirm_booking';

interface ChatbotServiceBookingFormProps {
  step: BookingStep;
  bookingData: any;
  onServiceSelect: (service: ServiceType) => void;
  onDetailsSubmit: (details: any) => void;
  onProjectInfoSubmit: (info: any) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  theme: 'light' | 'dark';
}

export default function ChatbotServiceBookingForm({
  step,
  bookingData,
  onServiceSelect,
  onDetailsSubmit,
  onProjectInfoSubmit,
  onConfirm,
  onCancel,
  loading,
  theme
}: ChatbotServiceBookingFormProps) {
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

  const [projectInfo, setProjectInfo] = useState({
    mainService: '',
    subServices: [] as string[],
    budget: '',
    timeline: '',
    currentChallenges: '',
    projectGoals: '',
    requirements: '',
    marketingConsent: false,
  });

  const [formValid, setFormValid] = useState(false);
  const [subServicesValid, setSubServicesValid] = useState(true);

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

  // Service options for step 1
  const serviceOptions = [
    { 
      id: 'digital_marketing', 
      name: '📈 Digital Marketing Service', 
      desc: 'SEO, PPC, Social Media, Content Marketing, Email Marketing, Analytics' 
    },
    { 
      id: 'automation', 
      name: '⚡ Automation Service', 
      desc: 'AI Workflow, Chatbots, Sales AI, Support AI, Custom AI Development' 
    },
    { 
      id: 'website_development', 
      name: '🌐 Website Development Service', 
      desc: 'Complete package: Design, Development, Hosting, SSL, SEO, Maintenance' 
    }
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

  // Budget options
  const budgetOptions = [
    'Under $1,000',
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+',
    'Need consultation'
  ];

  // Timeline options
  const timelineOptions = [
    'ASAP (1-2 weeks)',
    '1 month',
    '1-3 months',
    '3-6 months',
    '6+ months',
    'Flexible'
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

  // Get service name for display
  const getServiceName = (serviceId: ServiceType) => {
    const service = serviceOptions.find(s => s.id === serviceId);
    return service ? service.name.split(' ').slice(1).join(' ') : '';
  };

  // Get main service name from ID
  const getMainServiceName = (serviceId: ServiceType) => {
    switch (serviceId) {
      case 'digital_marketing': return 'Digital Marketing Service';
      case 'automation': return 'Automation Service';
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

  // Validate project info form
  useEffect(() => {
    const isValid = 
      projectInfo.mainService !== '' &&
      projectInfo.budget !== '' &&
      projectInfo.timeline !== '' &&
      projectInfo.currentChallenges.trim() !== '' &&
      projectInfo.projectGoals.trim() !== '';
    
    // Check if sub-services are selected for services that have them
    const mainServiceName = getMainServiceName(bookingData.service as ServiceType);
    const hasSubServices = services[mainServiceName as keyof typeof services]?.length > 0;
    
    if (hasSubServices && projectInfo.subServices.length === 0) {
      setSubServicesValid(false);
    } else {
      setSubServicesValid(true);
    }
    
    setFormValid(isValid && subServicesValid);
  }, [projectInfo, bookingData.service, subServicesValid]);

  // Handle details change
  const handleDetailChange = (field: string, value: string | boolean) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handle project info change
  const handleProjectInfoChange = (field: string, value: string | string[] | boolean) => {
    setProjectInfo(prev => ({ ...prev, [field]: value }));
  };

  // Handle checkbox for sub-services
  const handleSubServiceToggle = (service: string) => {
    setProjectInfo(prev => {
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

  // Handle submit project info
  const handleSubmitProjectInfo = () => {
    if (formValid && subServicesValid) {
      onProjectInfoSubmit(projectInfo);
    }
  };

  return (
    <div className="booking-form-container">
      {/* Step 1: Select Service */}
      {step === 'select_service' && (
        <div className={`booking-step service-selection ${theme}`}>
          <div className="booking-form-header">
            <h4>Select Service</h4>
            <p>Choose the service you want to book:</p>
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

      {/* Step 3: Project Information */}
      {step === 'project_info' && (
        <div className={`booking-step project-info-form ${theme}`}>
          <div className="booking-form-header">
            <h4>Project Details</h4>
            <p>Tell us about your project requirements:</p>
          </div>
          
          <div className="form-fields">
            <div className="form-group">
              <label>Estimated Budget *</label>
              <select
                value={projectInfo.budget}
                onChange={(e) => handleProjectInfoChange('budget', e.target.value)}
                className={theme}
                required
              >
                <option value="">Select budget range...</option>
                {budgetOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Project Timeline *</label>
              <select
                value={projectInfo.timeline}
                onChange={(e) => handleProjectInfoChange('timeline', e.target.value)}
                className={theme}
                required
              >
                <option value="">Select timeline...</option>
                {timelineOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {/* Sub-services selection - only show if service has sub-services */}
            {(() => {
              const mainServiceName = getMainServiceName(bookingData.service as ServiceType);
              const serviceSubServices = services[mainServiceName as keyof typeof services];
              
              if (serviceSubServices && serviceSubServices.length > 0) {
                return (
                  <div className="form-group">
                    <label>Select Sub-Services (Multiple choices allowed) *</label>
                    <div className="space-y-2">
                      {serviceSubServices.map((subService) => (
                        <div key={subService} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`sub-${subService}`}
                            checked={projectInfo.subServices.includes(subService)}
                            onChange={() => handleSubServiceToggle(subService)}
                            className="h-4 w-4"
                          />
                          <label htmlFor={`sub-${subService}`} className="ml-2 text-sm">
                            {subService}
                          </label>
                        </div>
                      ))}
                    </div>
                    {!subServicesValid && (
                      <p className="mt-1 text-xs text-red-500">Please select at least one sub-service</p>
                    )}
                  </div>
                );
              }
              
              if (mainServiceName === 'Website Development Service') {
                return (
                  <div className={`rounded-lg p-3 ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                    <p className={`text-sm ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
                      <strong>Note:</strong> Website Development Service includes complete package: Design, Development, Hosting, SSL, SEO, and Maintenance.
                    </p>
                  </div>
                );
              }
              
              return null;
            })()}
            
            <div className="form-group">
              <label>Current Challenges/Pain Points *</label>
              <textarea
                value={projectInfo.currentChallenges}
                onChange={(e) => handleProjectInfoChange('currentChallenges', e.target.value)}
                rows={3}
                placeholder="What challenges are you currently facing that you want us to solve?"
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Project Goals/Objectives *</label>
              <textarea
                value={projectInfo.projectGoals}
                onChange={(e) => handleProjectInfoChange('projectGoals', e.target.value)}
                rows={3}
                placeholder="What are your main goals and objectives for this project?"
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Additional Requirements & Information</label>
              <textarea
                value={projectInfo.requirements}
                onChange={(e) => handleProjectInfoChange('requirements', e.target.value)}
                rows={3}
                placeholder="Any other requirements, timeline expectations, or relevant information..."
                className={theme}
              />
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="marketingConsent"
                checked={projectInfo.marketingConsent}
                onChange={(e) => handleProjectInfoChange('marketingConsent', e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <label htmlFor="marketingConsent" className="ml-2 text-sm">
                I would like to receive marketing emails about services, promotions, and updates
              </label>
            </div>
          </div>
          
          <div className="booking-form-actions">
            <button onClick={() => onServiceSelect(bookingData.service)} className="cancel-btn">
              Back
            </button>
            <button 
              onClick={handleSubmitProjectInfo} 
              disabled={!formValid || !subServicesValid || loading}
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
            <h4>Review Booking</h4>
            <p>Please review your service booking details:</p>
          </div>
          
          <div className="booking-summary">
            <div className="summary-section">
              <h5>Service:</h5>
              <p>{getServiceName(bookingData.service)}</p>
              {projectInfo.subServices.length > 0 && (
                <p className="text-sm mt-1">
                  <strong>Sub-Services:</strong> {projectInfo.subServices.join(', ')}
                </p>
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
              <h5>Project Information:</h5>
              <p><strong>Budget:</strong> {projectInfo.budget}</p>
              <p><strong>Timeline:</strong> {projectInfo.timeline}</p>
              <p><strong>Current Challenges:</strong> {projectInfo.currentChallenges}</p>
              <p><strong>Project Goals:</strong> {projectInfo.projectGoals}</p>
              {projectInfo.requirements && (
                <p><strong>Requirements:</strong> {projectInfo.requirements}</p>
              )}
            </div>
          </div>
          
          <div className="confirmation-note">
            <p>✅ Confirmation email will be sent to <strong>{bookingData.email}</strong></p>
            <p>📞 Our team will contact you within 24 hours</p>
            <p className="text-xs mt-2">
              By confirming, you agree to our Privacy Policy and Terms of Service
            </p>
          </div>
          
          <div className="booking-form-actions">
            <button onClick={() => onProjectInfoSubmit(projectInfo)} className="cancel-btn">
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
              ) : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
