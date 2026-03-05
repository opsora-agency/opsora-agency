"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ConsentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [consentOptions, setConsentOptions] = useState({
    essential: true, // Required, cannot be turned off
    analytics: false,
    marketing: false,
    functional: false,
  });
  const [showCustomize, setShowCustomize] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [consentNumber, setConsentNumber] = useState("");

  // Generate unique consent number
  const generateConsentNumber = () => {
    return `CONS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  useEffect(() => {
    const hasConsented = localStorage.getItem("opsora-consent");
    if (!hasConsented) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  // Send consent email
  const sendConsentEmail = async (consentType: string, options: any) => {
    try {
      const response = await fetch('/api/send-consent-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: process.env.NEXT_PUBLIC_EMAIL_CONSENT || 'opsora.services@gmail.com',
          subject: `Consent Agreement - ${consentNumber}`,
          html: `
            <h2>New Consent Agreement</h2>
            <h3>Consent Information</h3>
            <p><strong>Consent Number:</strong> ${consentNumber}</p>
            <p><strong>Type:</strong> ${consentType}</p>
            <p><strong>User Email:</strong> ${userEmail || 'Not provided'}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            
            <h3>Consent Options Selected</h3>
            <p><strong>Essential:</strong> ${options.essential ? '✓ Accepted' : '✗ Rejected'}</p>
            <p><strong>Analytics:</strong> ${options.analytics ? '✓ Accepted' : '✗ Rejected'}</p>
            <p><strong>Marketing:</strong> ${options.marketing ? '✓ Accepted' : '✗ Rejected'}</p>
            <p><strong>Functional:</strong> ${options.functional ? '✓ Accepted' : '✗ Rejected'}</p>
            
            <hr>
            <p><em>This consent was recorded from the Opsora Agency website.</em></p>
          `,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send consent email:', error);
      return false;
    }
  };

  const handleAgreeAll = () => {
    if (!isAgreed) return;
    
    // Generate consent number if not exists
    if (!consentNumber) {
      setConsentNumber(generateConsentNumber());
    }
    
    // Set all optional cookies to accepted
    const newOptions = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    
    setConsentOptions(newOptions);
    
    // Save to localStorage
    const consentData = {
      timestamp: new Date().toISOString(),
      type: "all",
      options: newOptions,
      consentNumber: consentNumber || generateConsentNumber(),
      version: "1.0",
      userEmail: userEmail || null
    };
    
    localStorage.setItem("opsora-consent", JSON.stringify(consentData));
    
    // Send email notification
    sendConsentEmail("All Accepted", newOptions);
    
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    // Generate consent number if not exists
    if (!consentNumber) {
      setConsentNumber(generateConsentNumber());
    }
    
    // Only essential cookies accepted
    const newOptions = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    
    setConsentOptions(newOptions);
    
    // Save to localStorage
    const consentData = {
      timestamp: new Date().toISOString(),
      type: "essential_only",
      options: newOptions,
      consentNumber: consentNumber || generateConsentNumber(),
      version: "1.0",
      userEmail: userEmail || null
    };
    
    localStorage.setItem("opsora-consent", JSON.stringify(consentData));
    
    // Send email notification
    sendConsentEmail("Essential Only", newOptions);
    
    setIsVisible(false);
  };

  const handleCustomize = () => {
    // If popup is collapsed, expand it first (with smooth animation)
    if (!isExpanded) {
      setIsExpanded(true);
      // Wait for the expansion animation to complete (350ms), then show customize
      setTimeout(() => {
        setShowCustomize(true);
      }, 350); // Match this with your CSS transition duration
    } else {
      // Already expanded, just toggle the customize section
      setShowCustomize(!showCustomize);
    }
  };

  const saveConsent = (type: string) => {
    // Generate consent number if not exists
    const consentNum = consentNumber || generateConsentNumber();
    setConsentNumber(consentNum);
    
    const consentData = {
      timestamp: new Date().toISOString(),
      type: type,
      options: consentOptions,
      consentNumber: consentNum,
      version: "1.0",
      userEmail: userEmail || null
    };
    
    localStorage.setItem("opsora-consent", JSON.stringify(consentData));
    
    // Send email notification
    sendConsentEmail(type, consentOptions);
    
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsent("custom");
  };

  const toggleOption = (option: keyof typeof consentOptions) => {
    if (option === 'essential') return; // Can't toggle essential
    setConsentOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const toggleExpand = () => {
    // If expanding from collapsed state, ensure customize is closed
    if (!isExpanded) {
      setShowCustomize(false);
    }
    
    // Toggle expansion
    setIsExpanded(!isExpanded);
  };

  // New: Auto-check "I Understand" when Save Preferences is clicked
  useEffect(() => {
    if (showCustomize && Object.values(consentOptions).some(val => val === true)) {
      setIsAgreed(true);
    }
  }, [consentOptions, showCustomize]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay when expanded - Only on mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 z-[9998] md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Consent Banner - Fixed at bottom */}
      <div className={`fixed inset-x-0 bottom-0 z-[9999] transition-all duration-300 ${
        isExpanded ? "md:max-h-[80vh] overflow-y-auto" : ""
      }`}>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            {/* Collapsed State - Always visible */}
            <div className="rounded-t-2xl bg-gradient-to-r from-blue-900 to-blue-800 backdrop-blur-sm border-t border-l border-r border-blue-700 shadow-2xl">
              {/* Collapsed Header */}
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    {/* First Line - Red colored for attention */}
                    <p className="text-red-300 text-sm md:text-base font-semibold mb-1">
                      We need your consent to use cookies and AI chatbot
                    </p>
                    {/* Second Line - Regular text */}
                    <p className="text-blue-100 text-sm md:text-base">
                      By accepting, you agree to our Privacy Policy, Terms of Service, and Cookie Policy.
                    </p>
                    
                    {/* Optional email input for consent tracking */}
                    <div className="mt-3">
                      <label className="text-blue-100 text-sm mr-2">Email for consent record (optional):</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="px-3 py-1 rounded text-sm border border-blue-600 bg-blue-900/50 text-white placeholder-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={toggleExpand}
                      className="text-blue-100 hover:text-white text-sm font-medium underline whitespace-nowrap"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="consent-checkbox"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className="h-5 w-5 rounded border-blue-300 bg-blue-100/20 checked:bg-blue-500 text-blue-500 focus:ring-blue-300"
                      />
                      <label htmlFor="consent-checkbox" className="text-white text-sm whitespace-nowrap">
                        I Understand
                      </label>
                    </div>
                    
                    <div className="flex gap-2">
                      
                      {/*<button
                        onClick={handleRejectAll}
                        disabled={!isAgreed}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                          isAgreed 
                            ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95" 
                            : "bg-blue-600/30 text-blue-100/70 cursor-not-allowed"
                        }`}
                      >
                        Reject All
                      </button>*/}

                      <button
                        onClick={handleCustomize}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                          "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                        }`}
                      >
                        Customize
                      </button>
                      <button
                        onClick={handleAgreeAll}
                        disabled={!isAgreed}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                          isAgreed 
                            ? "bg-white text-blue-900 hover:bg-blue-50 active:scale-95" 
                            : "bg-blue-600/30 text-blue-100/70 cursor-not-allowed"
                        }`}
                      >
                        Accept All
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content - Slides down */}
              <div className={`overflow-hidden transition-all duration-500 ${
                isExpanded ? "max-h-[500px] md:max-h-[400px] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
              }`}>
                <div className="border-t border-blue-700 p-4 md:p-6 bg-blue-800/95">
                  
                  {/* Cookie Customization Options (slides when customize clicked) */}
                  <div className={`overflow-hidden transition-all duration-500 ${
                    showCustomize ? "max-h-[800px] opacity-100 mb-6" : "max-h-0 opacity-0"
                  }`}>
                    {showCustomize && (
                      <>
                        <h4 className="text-white font-semibold mb-3">Customize Your Preferences</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-blue-900/50 rounded-lg">
                            <div>
                              <p className="text-white font-medium">Essential Cookies</p>
                              <p className="text-blue-200 text-sm">Required for site to function</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-green-400 text-sm font-medium mr-2">Always On</span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={true}
                                  disabled
                                  className="h-5 w-5 rounded border-blue-300 bg-blue-500 cursor-not-allowed"
                                />
                              </div>
                            </div>
                          </div>

                          {[
                            { id: 'analytics', name: 'Analytics Cookies', desc: 'Help us improve website experience' },
                            { id: 'marketing', name: 'Marketing Cookies', desc: 'Show relevant content and offers' },
                            { id: 'functional', name: 'Functional Cookies', desc: 'Remember your preferences' },
                          ].map((cookie) => (
                            <div key={cookie.id} className="flex items-center justify-between p-3 bg-blue-900/50 rounded-lg">
                              <div>
                                <p className="text-white font-medium">{cookie.name}</p>
                                <p className="text-blue-200 text-sm">{cookie.desc}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={consentOptions[cookie.id as keyof typeof consentOptions]}
                                  onChange={() => toggleOption(cookie.id as keyof typeof consentOptions)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-blue-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => setShowCustomize(false)}
                            className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleSavePreferences}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                           Agree
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Regular expanded content (when not in customize mode) */}
                  {!showCustomize && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column - Policies */}
                      <div>
                        <h4 className="text-white font-semibold mb-3">Our Legal Documents</h4>
                        <div className="space-y-2">
                          <Link 
                            href="/Consent/PrivacyPolicy" 
                            target="_blank"
                            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm p-2 hover:bg-blue-700/30 rounded"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Privacy Policy</span>
                          </Link>
                          
                          <Link 
                            href="/Consent/TermsOfService" 
                            target="_blank"
                            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm p-2 hover:bg-blue-700/30 rounded"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m7.618 4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Terms of Service</span>
                          </Link>
                          
                          <Link 
                            href="/Consent/TermsAndConditions" 
                            target="_blank"
                            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm p-2 hover:bg-blue-700/30 rounded"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m7.618 4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Terms & Conditions</span>
                          </Link>
                          
                          <Link 
                            href="/Consent/CookiePolicy" 
                            target="_blank"
                            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm p-2 hover:bg-blue-700/30 rounded"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Cookie Policy</span>
                          </Link>
                          
                          <Link 
                            href="/Consent/Disclaimer" 
                            target="_blank"
                            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm p-2 hover:bg-blue-700/30 rounded"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>Disclaimer</span>
                          </Link>
                        </div>
                      </div>

                      {/* Right Column - Details */}
                      <div>
                        <h4 className="text-white font-semibold mb-3">Your Rights & Our Usage</h4>
                        <div className="text-blue-100 text-sm space-y-3">
                          <p>
                            <span className="font-medium text-white">Your Rights:</span>
                            <ul className="mt-1 ml-4 list-disc space-y-1">
                              <li>Right to access your data</li>
                              <li>Right to correct your data</li>
                              <li>Right to delete your data</li>
                              <li>Right to withdraw consent anytime</li>
                            </ul>
                          </p>
                          <p>
                            <span className="font-medium text-white">We Use:</span>
                            <ul className="mt-1 ml-4 list-disc space-y-1">
                              <li>AI Chatbot for customer support</li>
                              <li>Cookies for essential functions</li>
                              <li>Optional cookies for analytics & marketing</li>
                              <li>Secure data encryption</li>
                            </ul>
                          </p>
                          <p className="text-xs text-blue-200 italic mt-3">
                            Consent is stored for 12 months. You can update preferences anytime by contacting us.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Only - Close Button */}
                  <div className="mt-4 md:hidden">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="w-full py-2 border border-blue-400 rounded-lg text-white hover:bg-blue-700/50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsentPopup;
