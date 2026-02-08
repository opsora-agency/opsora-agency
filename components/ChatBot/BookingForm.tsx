'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type ServiceType = 'ai_chatbot' | 'workflow_automation' | 'sales_ai' | 'support_ai' | 'custom_ai';
type BookingStep = 'select_service' | 'collect_details' | 'select_time' | 'confirm_booking';

interface BookingFormProps {
  step: BookingStep;
  bookingData: any;
  onServiceSelect: (service: ServiceType) => void;
  onDetailsSubmit: (details: any) => void;
  onTimeSelect: (date: string, time: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  theme: 'light' | 'dark';
}

export default function BookingForm({
  step,
  bookingData,
  onServiceSelect,
  onDetailsSubmit,
  onTimeSelect,
  onConfirm,
  onCancel,
  loading,
  theme
}: BookingFormProps) {
  const [details, setDetails] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    requirements: ''
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formValid, setFormValid] = useState(false);

  // Service options
  const services = [
    { id: 'ai_chatbot', name: '🤖 AI Chatbot Development', desc: 'Natural Language Processing, Multi-platform' },
    { id: 'workflow_automation', name: '⚡ Workflow Automation', desc: 'Business process automation, AI workflows' },
    { id: 'sales_ai', name: '📈 Sales AI Agent', desc: 'Lead generation, Automated sales pipelines' },
    { id: 'support_ai', name: '🛠️ Support AI Agent', desc: '24/7 instant support, Ticket management' },
    { id: 'custom_ai', name: '🎨 Custom AI Solution', desc: 'Tailored development, Industry-specific' }
  ];

  // Time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  // Next 7 days
  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
    return days;
  };

  // Validate details form
  useEffect(() => {
    const isValid = 
      details.name.trim() !== '' &&
      details.email.includes('@') &&
      details.email.includes('.') &&
      details.requirements.trim() !== '';
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

  // Handle time selection
  const handleTimeSelection = () => {
    if (selectedDate && selectedTime) {
      onTimeSelect(selectedDate, selectedTime);
    }
  };

  // Get service name
  const getServiceName = (serviceId: ServiceType) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name.split(' ').slice(1).join(' ') : '';
  };

  return (
    <div className="booking-form-container">
      {/* Step 1: Select Service */}
      {step === 'select_service' && (
        <div className={`booking-step service-selection ${theme}`}>
          <div className="booking-form-header">
            <h4>Select a Service</h4>
            <p>Choose the service you'd like a demo for:</p>
          </div>
          
          <div className="service-options">
            {services.map((service) => (
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
            <button onClick={onCancel} className="cancel-btn">Cancel Booking</button>
          </div>
        </div>
      )}

      {/* Step 2: Collect Details */}
      {step === 'collect_details' && (
        <div className={`booking-step details-form ${theme}`}>
          <div className="booking-form-header">
            <h4>Your Details</h4>
            <p>Please provide your information:</p>
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
              />
            </div>
            
            <div className="form-group">
              <label>Company Name (Optional)</label>
              <input
                type="text"
                value={details.company}
                onChange={(e) => handleDetailChange('company', e.target.value)}
                placeholder="Your Company"
                className={theme}
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number (Optional)</label>
              <input
                type="tel"
                value={details.phone}
                onChange={(e) => handleDetailChange('phone', e.target.value)}
                placeholder="+91 1234567890"
                className={theme}
              />
            </div>
            
            <div className="form-group">
              <label>Brief Requirements *</label>
              <textarea
                value={details.requirements}
                onChange={(e) => handleDetailChange('requirements', e.target.value)}
                placeholder="What are you looking to achieve? (e.g., 'Automate customer support', 'Generate more leads')"
                rows={3}
                className={theme}
              />
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

      {/* Step 3: Select Time */}
      {step === 'select_time' && (
        <div className={`booking-step time-selection ${theme}`}>
          <div className="booking-form-header">
            <h4>Select Demo Time</h4>
            <p>Choose your preferred date and time:</p>
          </div>
          
          <div className="time-selection-grid">
            <div className="date-selection">
              <h5>Select Date:</h5>
              <div className="date-options">
                {getNextDays().map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`date-option ${selectedDate === date ? 'selected' : ''} ${theme}`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="time-selection">
              <h5>Select Time:</h5>
              <div className="time-options">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`time-option ${selectedTime === time ? 'selected' : ''} ${theme}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="selected-time-display">
            {selectedDate && selectedTime && (
              <div className="time-summary">
                <span>🗓️ Selected: </span>
                <strong>{selectedDate} at {selectedTime}</strong>
              </div>
            )}
          </div>
          
          <div className="booking-form-actions">
            <button onClick={onCancel} className="cancel-btn">Back</button>
            <button 
              onClick={handleTimeSelection} 
              disabled={!selectedDate || !selectedTime || loading}
              className="continue-btn"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm Booking */}
      {step === 'confirm_booking' && (
        <div className={`booking-step confirmation ${theme}`}>
          <div className="booking-form-header">
            <h4>Review Booking</h4>
            <p>Please review your booking details:</p>
          </div>
          
          <div className="booking-summary">
            <div className="summary-section">
              <h5>Service:</h5>
              <p>{getServiceName(bookingData.service)}</p>
            </div>
            
            <div className="summary-section">
              <h5>Personal Details:</h5>
              <p><strong>Name:</strong> {bookingData.name}</p>
              <p><strong>Email:</strong> {bookingData.email}</p>
              {bookingData.company && <p><strong>Company:</strong> {bookingData.company}</p>}
              {bookingData.phone && <p><strong>Phone:</strong> {bookingData.phone}</p>}
            </div>
            
            <div className="summary-section">
              <h5>Requirements:</h5>
              <p>{bookingData.requirements}</p>
            </div>
            
            <div className="summary-section">
              <h5>Demo Time:</h5>
              <p><strong>{bookingData.preferredDate}</strong> at <strong>{bookingData.preferredTime}</strong></p>
            </div>
          </div>
          
          <div className="confirmation-note">
            <p>✅ Confirmation email will be sent to <strong>{bookingData.email}</strong></p>
            <p>📞 Our team will contact you within 24 hours</p>
          </div>
          
          <div className="booking-form-actions">
            <button onClick={onCancel} className="cancel-btn">Edit Booking</button>
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