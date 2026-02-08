'use client';

import { useState, useEffect } from 'react';

type SupportCategory = 'account' | 'billing' | 'technical' | 'feature' | 'security' | 'api' | 'general' | 'bug';
type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
type SupportStep = 'select_category' | 'collect_details' | 'issue_details' | 'confirm_submission';

interface ChatbotSupportFormProps {
  step: SupportStep;
  supportData: any;
  onCategorySelect: (category: SupportCategory) => void;
  onDetailsSubmit: (details: any) => void;
  onIssueSubmit: (issue: any) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  theme: 'light' | 'dark';
}

export default function ChatbotSupportForm({
  step,
  supportData,
  onCategorySelect,
  onDetailsSubmit,
  onIssueSubmit,
  onConfirm,
  onCancel,
  loading,
  theme
}: ChatbotSupportFormProps) {
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
  });

  const [issue, setIssue] = useState({
    category: '',
    priority: 'medium' as PriorityLevel,
    message: '',
    errorMessages: '',
    stepsToReproduce: '',
    browserDeviceInfo: '',
    accountOrderNumbers: '',
  });

  const [formValid, setFormValid] = useState(false);

  // Support category options
  const categoryOptions = [
    { 
      id: 'account', 
      name: '👤 Account Issues', 
      desc: 'Login problems, account settings, profile updates, or access issues' 
    },
    { 
      id: 'billing', 
      name: '💰 Billing & Payments', 
      desc: 'Invoice questions, payment methods, subscription changes, or refund requests' 
    },
    { 
      id: 'technical', 
      name: '🛠️ Technical Problems', 
      desc: 'Bug reports, errors, performance issues, or technical difficulties' 
    },
    { 
      id: 'feature', 
      name: '✨ Feature Requests', 
      desc: 'Suggest new features, improvements, or changes to our services' 
    },
    { 
      id: 'security', 
      name: '🔒 Account Security', 
      desc: 'Security concerns, suspicious activity, password resets, or 2FA issues' 
    },
    { 
      id: 'api', 
      name: '🔌 API & Integration', 
      desc: 'API documentation, integration help, webhooks, or developer support' 
    },
    { 
      id: 'bug', 
      name: '🐛 Bug Report', 
      desc: 'Report software bugs, glitches, or unexpected behavior' 
    },
    { 
      id: 'general', 
      name: '❓ General Support', 
      desc: 'General questions or issues not covered in other categories' 
    }
  ];

  // Priority options
  const priorityOptions = [
    { id: 'low', name: 'Low Priority', desc: 'General questions, no urgency', color: 'text-blue-600' },
    { id: 'medium', name: 'Medium Priority', desc: 'Issues affecting functionality', color: 'text-yellow-600' },
    { id: 'high', name: 'High Priority', desc: 'Critical issues needing attention', color: 'text-orange-600' },
    { id: 'urgent', name: 'Urgent', desc: 'System down or blocking issues', color: 'text-red-600' }
  ];

  // Response times based on priority
  const responseTimes = {
    'urgent': '2-4 hours',
    'high': '4-8 hours',
    'medium': '24 hours',
    'low': '48 hours'
  };

  // Get priority color class
  const getPriorityColorClass = (priority: PriorityLevel) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  // Get category name for display
  const getCategoryName = (categoryId: SupportCategory) => {
    const category = categoryOptions.find(c => c.id === categoryId);
    return category ? category.name.split(' ').slice(1).join(' ') : '';
  };

  // Get priority name for display
  const getPriorityName = (priorityId: PriorityLevel) => {
    const priority = priorityOptions.find(p => p.id === priorityId);
    return priority ? priority.name : '';
  };

  // Validate details form
  useEffect(() => {
    const isValid = 
      details.name.trim() !== '' &&
      details.email.includes('@') &&
      details.email.includes('.') &&
      details.subject.trim() !== '';
    setFormValid(isValid);
  }, [details]);

  // Validate issue form
  useEffect(() => {
    const isValid = 
      issue.message.trim() !== '';
    setFormValid(isValid);
  }, [issue]);

  // Handle details change
  const handleDetailChange = (field: string, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handle issue change
  const handleIssueChange = (field: string, value: string) => {
    setIssue(prev => ({ ...prev, [field]: value }));
  };

  // Handle priority change
  const handlePriorityChange = (priority: PriorityLevel) => {
    setIssue(prev => ({ ...prev, priority }));
  };

  // Handle submit details
  const handleSubmitDetails = () => {
    if (formValid) {
      onDetailsSubmit(details);
    }
  };

  // Handle submit issue
  const handleSubmitIssue = () => {
    if (formValid) {
      onIssueSubmit(issue);
    }
  };

  return (
    <div className="booking-form-container">
      {/* Step 1: Select Category */}
      {step === 'select_category' && (
        <div className={`booking-step service-selection ${theme}`}>
          <div className="booking-form-header">
            <h4>Support Category</h4>
            <p>What type of support do you need?</p>
          </div>
          
          <div className="service-options">
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id as SupportCategory)}
                className={`service-option ${theme}`}
              >
                <div className="service-icon">{category.name.split(' ')[0]}</div>
                <div className="service-info">
                  <div className="service-name">{category.name.split(' ').slice(1).join(' ')}</div>
                  <div className="service-desc">{category.desc}</div>
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
                placeholder="Brief description of your issue"
                className={theme}
                required
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

      {/* Step 3: Issue Details */}
      {step === 'issue_details' && (
        <div className={`booking-step issue-form ${theme}`}>
          <div className="booking-form-header">
            <h4>Issue Details</h4>
            <p>Please describe your issue in detail:</p>
          </div>
          
          <div className="form-fields">
            <div className="form-group">
              <label>Priority Level *</label>
              <div className="priority-options grid grid-cols-2 gap-2">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority.id}
                    onClick={() => handlePriorityChange(priority.id as PriorityLevel)}
                    className={`priority-option ${issue.priority === priority.id ? 'selected' : ''} ${theme}`}
                  >
                    <div className={`priority-name ${priority.color}`}>{priority.name}</div>
                    <div className="priority-desc text-xs opacity-70">{priority.desc}</div>
                    <div className="priority-response text-xs mt-1">
                      Response: {responseTimes[priority.id as PriorityLevel]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Message *</label>
              <textarea
                value={issue.message}
                onChange={(e) => handleIssueChange('message', e.target.value)}
                rows={4}
                placeholder="Please describe your issue in detail. Include what you were trying to do, what happened, and what you expected to happen."
                className={theme}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Error Messages (If any)</label>
              <textarea
                value={issue.errorMessages}
                onChange={(e) => handleIssueChange('errorMessages', e.target.value)}
                rows={2}
                placeholder="Copy and paste any error messages you received"
                className={theme}
              />
            </div>
            
            <div className="form-group">
              <label>Steps to Reproduce (If applicable)</label>
              <textarea
                value={issue.stepsToReproduce}
                onChange={(e) => handleIssueChange('stepsToReproduce', e.target.value)}
                rows={2}
                placeholder="Step-by-step instructions to reproduce the issue"
                className={theme}
              />
            </div>
            
            <div className="form-group">
              <label>Browser/Device Information</label>
              <input
                type="text"
                value={issue.browserDeviceInfo}
                onChange={(e) => handleIssueChange('browserDeviceInfo', e.target.value)}
                placeholder="e.g., Chrome 120, Windows 11, iPhone 15"
                className={theme}
              />
            </div>
            
            <div className="form-group">
              <label>Account/Order Numbers (If applicable)</label>
              <input
                type="text"
                value={issue.accountOrderNumbers}
                onChange={(e) => handleIssueChange('accountOrderNumbers', e.target.value)}
                placeholder="Account ID, Order #, Invoice #, etc."
                className={theme}
              />
            </div>
            
            <div className={`tips-section rounded-lg p-3 ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
              <h5 className="font-medium mb-2">Tips for Faster Support:</h5>
              <ul className="text-xs space-y-1">
                <li>• Include error messages and screenshots if possible</li>
                <li>• Describe steps to reproduce the issue</li>
                <li>• Specify your browser/device details</li>
                <li>• Provide account/order numbers when applicable</li>
              </ul>
            </div>
          </div>
          
          <div className="booking-form-actions">
            <button onClick={() => onDetailsSubmit(details)} className="cancel-btn">
              Back
            </button>
            <button 
              onClick={handleSubmitIssue} 
              disabled={!formValid || loading}
              className="continue-btn"
            >
              {loading ? 'Saving...' : 'Review Ticket'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm Submission */}
      {step === 'confirm_submission' && (
        <div className={`booking-step confirmation ${theme}`}>
          <div className="booking-form-header">
            <h4>Review Support Ticket</h4>
            <p>Please review your ticket before submitting:</p>
          </div>
          
          <div className="booking-summary">
            <div className="summary-section">
              <h5>Ticket Information:</h5>
              <p><strong>Category:</strong> {getCategoryName(supportData.category)}</p>
              <p>
                <strong>Priority:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${getPriorityColorClass(supportData.priority)}`}>
                  {getPriorityName(supportData.priority)} ({responseTimes[supportData.priority]})
                </span>
              </p>
              <p><strong>Subject:</strong> {supportData.subject}</p>
            </div>
            
            <div className="summary-section">
              <h5>Contact Details:</h5>
              <p><strong>Name:</strong> {supportData.name}</p>
              <p><strong>Email:</strong> {supportData.email}</p>
              {supportData.phone && <p><strong>Phone:</strong> {supportData.phone}</p>}
              {supportData.company && <p><strong>Company:</strong> {supportData.company}</p>}
            </div>
            
            <div className="summary-section">
              <h5>Issue Details:</h5>
              <p><strong>Message:</strong> {supportData.message}</p>
              {supportData.errorMessages && (
                <p className="text-sm mt-1"><strong>Error Messages:</strong> {supportData.errorMessages}</p>
              )}
              {supportData.stepsToReproduce && (
                <p className="text-sm mt-1"><strong>Steps to Reproduce:</strong> {supportData.stepsToReproduce}</p>
              )}
              {supportData.browserDeviceInfo && (
                <p className="text-sm mt-1"><strong>Browser/Device:</strong> {supportData.browserDeviceInfo}</p>
              )}
              {supportData.accountOrderNumbers && (
                <p className="text-sm mt-1"><strong>Account/Order #:</strong> {supportData.accountOrderNumbers}</p>
              )}
            </div>
          </div>
          
          <div className="confirmation-note">
            <p>✅ Ticket ID: <strong>#{Math.floor(100000 + Math.random() * 900000)}</strong></p>
            <p>📧 Response will be sent to <strong>{supportData.email}</strong></p>
            <p>⏱️ Expected response time: <strong>{responseTimes[supportData.priority]}</strong></p>
            <p className="text-xs mt-2">
              By submitting, you agree to our Privacy Policy and Support Terms
            </p>
          </div>
          
          <div className="booking-form-actions">
            <button onClick={() => onIssueSubmit(issue)} className="cancel-btn">
              Edit Ticket
            </button>
            <button 
              onClick={onConfirm} 
              disabled={loading}
              className="confirm-btn"
            >
              {loading ? (
                <>
                  <div className="booking-spinner"></div>
                  Submitting...
                </>
              ) : 'Submit Support Ticket'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}