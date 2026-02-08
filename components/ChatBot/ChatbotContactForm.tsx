'use client';

import { useState, useEffect } from 'react';

type ContactType = 'general_inquiry' | 'pricing' | 'technical' | 'partnership' | 'other';
type ContactStep = 'select_type' | 'collect_details' | 'confirm_submission';

interface ChatbotContactFormProps {
  step: ContactStep;
  contactData: any;
  onTypeSelect: (type: ContactType) => void;
  onDetailsSubmit: (details: any) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  theme: 'light' | 'dark';
}

export default function ChatbotContactForm({
  step,
  contactData,
  onTypeSelect,
  onDetailsSubmit,
  onConfirm,
  onCancel,
  loading,
  theme
}: ChatbotContactFormProps) {
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    preferredContact: 'email' as 'email' | 'phone' | 'whatsapp',
  });

  const [formValid, setFormValid] = useState(false);

  // Contact type options
  const contactTypeOptions = [
    { 
      id: 'general_inquiry', 
      name: '📧 General Inquiry', 
      desc: 'General questions about our services, company, or partnership opportunities' 
    },
    { 
      id: 'pricing', 
      name: '💰 Pricing & Quotes', 
      desc: 'Request pricing information, custom quotes, or discuss budget options' 
    },
    { 
      id: 'technical', 
      name: '🛠️ Technical Question', 
      desc: 'Technical questions, API integration, implementation details' 
    },
    { 
      id: 'partnership', 
      name: '🤝 Partnership', 
      desc: 'Business partnerships, affiliate programs, reseller opportunities' 
    },
    { 
      id: 'other', 
      name: '❓ Other Question', 
      desc: 'Any other questions or concerns not covered above' 
    }
  ];

  // Get contact type name for display
  const getContactTypeName = (typeId: ContactType) => {
    const type = contactTypeOptions.find(t => t.id === typeId);
    return type ? type.name.split(' ').slice(1).join(' ') : '';
  };

  // Validate form
  useEffect(() => {
    const isValid = 
      details.name.trim() !== '' &&
      details.email.includes('@') &&
      details.email.includes('.') &&
      details.subject.trim() !== '' &&
      details.message.trim() !== '';
    setFormValid(isValid);
  }, [details]);

  // Handle details change
  const handleDetailChange = (field: string, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handle submit details
  const handleSubmitDetails = () => {
    if (formValid) {
      onDetailsSubmit(details);
    }
  };

  return (
    <div className="booking-form-container">
      {/* Step 1: Select Contact Type */}
      {step === 'select_type' && (
        <div className={`booking-step service-selection ${theme}`}>
          <div className="booking-form-header">
            <h4>Contact Type</h4>
            <p>What would you like to contact us about?</p>
          </div>
          
          <div className="service-options">
            {contactTypeOptions.map((type) => (
              <button
                key={type.id}
                onClick={() => onTypeSelect(type.id as ContactType)}
                className={`service-option ${theme}`}
              >
                <div className="service-icon">{type.name.split(' ')[0]}</div>
                <div className="service-info">
                  <div className="service-name">{type.name.split(' ').slice(1).join(' ')}</div>
                  <div className="service-desc">{type.desc}</div>
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
            <h4>Contact Details</h4>
            <p>Please provide your information and message:</p>
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
              <label>Email Address *</label>
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
              <label>Phone Number (Optional)</label>
              <input
                type="tel"
                value={details.phone}
                onChange={(e) => handleDetailChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className={theme}
              />
            </div>
            
            <div className="form-group">
              <label>Company Name (Optional)</label>
              <input
                type="text"
                value={details.company}
                onChange={(e) => handleDetailChange('company', e.target.value)}
                placeholder="Your Company Inc."
                className={theme}
              />
            </div>
            
            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                value={details.subject}
                onChange={(e) => handleDetailChange('subject', e.target.value)}
                placeholder="Brief description of your inquiry"
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Message *</label>
              <textarea
                value={details.message}
                onChange={(e) => handleDetailChange('message', e.target.value)}
                rows={4}
                placeholder="Please provide details about your inquiry. Include any relevant information that will help us understand and respond to your question."
                className={theme}
                required
              />
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
              {loading ? 'Saving...' : 'Review Message'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm Submission */}
      {step === 'confirm_submission' && (
        <div className={`booking-step confirmation ${theme}`}>
          <div className="booking-form-header">
            <h4>Review Contact Message</h4>
            <p>Please review your message before sending:</p>
          </div>
          
          <div className="booking-summary">
            <div className="summary-section">
              <h5>Contact Type:</h5>
              <p>{getContactTypeName(contactData.type)}</p>
            </div>
            
            <div className="summary-section">
              <h5>Contact Details:</h5>
              <p><strong>Name:</strong> {contactData.name}</p>
              <p><strong>Email:</strong> {contactData.email}</p>
              {contactData.phone && <p><strong>Phone:</strong> {contactData.phone}</p>}
              {contactData.company && <p><strong>Company:</strong> {contactData.company}</p>}
              <p><strong>Preferred Contact:</strong> {contactData.preferredContact}</p>
            </div>
            
            <div className="summary-section">
              <h5>Message Details:</h5>
              <p><strong>Subject:</strong> {contactData.subject}</p>
              <p><strong>Message:</strong> {contactData.message}</p>
            </div>
          </div>
          
          <div className="confirmation-note">
            <p>✅ Response will be sent to <strong>{contactData.email}</strong></p>
            <p>📧 We aim to respond within 24 hours</p>
            <p className="text-xs mt-2">
              By submitting, you agree to our Privacy Policy
            </p>
          </div>
          
          <div className="booking-form-actions">
            <button onClick={() => onDetailsSubmit(details)} className="cancel-btn">
              Edit Message
            </button>
            <button 
              onClick={onConfirm} 
              disabled={loading}
              className="confirm-btn"
            >
              {loading ? (
                <>
                  <div className="booking-spinner"></div>
                  Sending...
                </>
              ) : 'Send Message'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}