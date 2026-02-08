'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatbotServiceBookingForm from './ChatbotServiceBookingForm';
import ChatbotDemoBookingForm from './ChatbotDemoBookingForm';
import ChatbotContactForm from './ChatbotContactForm';
import ChatbotSupportForm from './ChatbotSupportForm';
import './ChatBot.css';
import Image from 'next/image';

// Form type definitions
type FormType = 'service_booking' | 'demo_booking' | 'contact' | 'support' | null;
type BookingStep = 'select_service' | 'collect_details' | 'project_info' | 'confirm_booking';
type DemoStep = 'select_service' | 'collect_details' | 'demo_schedule' | 'confirm_booking';
type ContactStep = 'select_type' | 'collect_details' | 'confirm_submission';
type SupportStep = 'select_category' | 'collect_details' | 'issue_details' | 'confirm_submission';
type ServiceType = 'digital_marketing' | 'automation' | 'website_development';
type ContactType = 'general_inquiry' | 'pricing' | 'technical' | 'partnership' | 'other';
type SupportCategory = 'account' | 'billing' | 'technical' | 'feature' | 'security' | 'api' | 'general' | 'bug';
type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `🤖 **Hello! I'm Opsora AI Assistant**\n\nI can help you with:\n\n📅 **Book Services/Demos**\n💰 **Get Pricing & Quotes**\n📞 **Contact Our Team**\n🚀 **Learn About Our Services**\n🛠️ **Get Support**\n❓ **Answer Any Questions**\n\n*Try saying: "book demo", "book service", "contact", "support", "pricing", or ask anything!*` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Form state management
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [bookingStep, setBookingStep] = useState<BookingStep>('select_service');
  const [demoStep, setDemoStep] = useState<DemoStep>('select_service');
  const [contactStep, setContactStep] = useState<ContactStep>('select_type');
  const [supportStep, setSupportStep] = useState<SupportStep>('select_category');
  
  // Form data
  const [bookingData, setBookingData] = useState({
    service: '' as ServiceType | '',
    name: '',
    email: '',
    company: '',
    phone: '',
    jobTitle: '',
    industry: '',
    otherIndustry: '',
    referralSource: '',
    preferredContact: 'email' as 'email' | 'phone' | 'whatsapp',
    requirements: '',
    projectInfo: null as any,
  });

  const [demoData, setDemoData] = useState({
    service: '' as ServiceType | '',
    name: '',
    email: '',
    company: '',
    phone: '',
    jobTitle: '',
    industry: '',
    otherIndustry: '',
    referralSource: '',
    preferredContact: 'email' as 'email' | 'phone' | 'whatsapp',
    schedule: null as any,
  });

  const [contactData, setContactData] = useState({
    type: '' as ContactType | '',
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    preferredContact: 'email' as 'email' | 'phone' | 'whatsapp',
  });

  const [supportData, setSupportData] = useState({
    category: '' as SupportCategory | '',
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    priority: 'medium' as PriorityLevel,
    message: '',
    errorMessages: '',
    stepsToReproduce: '',
    browserDeviceInfo: '',
    accountOrderNumbers: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Theme detection
  useEffect(() => {
    const detectTheme = () => {
      if (document.documentElement.classList.contains('dark') || 
          document.documentElement.getAttribute('data-theme') === 'dark') {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };
    detectTheme();
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    });
    return () => observer.disconnect();
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus textarea when sidebar opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to toggle chat
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      
      // Escape to close chat
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
      
      // Tab to focus textarea
      if (e.key === 'Tab' && isOpen) {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // ========== SMART COMMAND DETECTION ==========
  const processSmartCommand = (userMessage: string): string | null => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Contact info
    if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone') || lowerMsg.includes('call') || lowerMsg.includes('whatsapp')) {
      return `📞 **Contact Opsora Agency:**\n\n• **Email:** opsoraagency@gmail.com\n• **Phone:** +91 8401765505\n• **WhatsApp:** https://wa.me/918401765505\n• **24/7 Support:** Available\n\n*Want to book a demo or get pricing? Just ask!*`;
    }
    
    // Services list
    if (lowerMsg.includes('service') || lowerMsg.includes('offer') || lowerMsg.includes('what do you do') || lowerMsg.includes('provide')) {
      return `🚀 **Our Services:**\n\n1. **🤖 AI Chatbot Development**\n   - Natural Language Processing\n   - Multi-platform deployment\n   - 24/7 customer support\n\n2. **⚡ Workflow Automation**\n   - Business process automation\n   - AI-powered workflows\n\n3. **📈 Sales AI Agents**\n   - Lead generation & qualification\n   - Automated sales pipelines\n\n4. **🛠️ Support AI Agents**\n   - 24/7 instant support\n   - Ticket management\n\n5. **🎨 Custom AI Solutions**\n   - Tailored AI development\n   - Industry-specific solutions\n\n*Book a free demo to see which service fits your needs!*`;
    }
    
    // Pricing
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much') || lowerMsg.includes('quote')) {
      return `💰 **Pricing Information:**\n\n• **Basic Plan:** Custom pricing\n  - Basic chatbot/automation\n  - Email support\n  - Monthly reports\n\n• **Professional Plan:** Custom pricing\n  - Advanced AI features\n  - Multi-platform\n  - Priority support\n\n• **Enterprise Plan:** Custom pricing\n  - Custom development\n  - Dedicated support\n  - API access\n\n**All plans include:**\n✓ No setup fees\n✓ Free demo trial\n✓ 24/7 support\n\n*For exact pricing, book a demo with our team!*`;
    }
    
    // About company
    if (lowerMsg.includes('about') || lowerMsg.includes('who are you') || lowerMsg.includes('company') || lowerMsg.includes('opsora')) {
      return `🏢 **About Opsora Agency:**\n\nWe provide **Digital Solutions for Sustainable Growth**.\n\n**What we do:**\n• End-to-end marketing automation\n• CRM integration\n• Performance-driven strategies\n• AI-powered solutions\n\n**Our mission:** Build sustainable revenue pipelines and operational efficiency for modern businesses.\n\n*Trusted by 50+ businesses worldwide.*`;
    }
    
    // Tools/tech
    if (lowerMsg.includes('tool') || lowerMsg.includes('technology') || lowerMsg.includes('use') || lowerMsg.includes('tech stack')) {
      return `🛠️ **Technologies We Use:**\n\n• **AI & LLMs:** OpenAI GPT-4, Groq LLaMA 3.1, Claude AI\n• **Automation:** n8n, Zapier, Make.com, LangChain\n• **CRM:** HubSpot, Salesforce, Zoho, Pipedrive\n• **Communication:** WhatsApp Business, Telegram API, Slack\n\n*We use industry-leading tools to deliver robust solutions.*`;
    }
    
    // Results/benefits
    if (lowerMsg.includes('result') || lowerMsg.includes('benefit') || lowerMsg.includes('achieve') || lowerMsg.includes('deliver')) {
      return `📊 **Results We Deliver:**\n\n• **80%** query resolution without human help\n• **24/7** availability for customer support\n• **4.8/5** customer satisfaction rating\n• **70%** cost reduction vs traditional support\n• **50+** businesses successfully transformed\n\n*Our solutions are proven to drive real business growth.*`;
    }
    
    return null;
  };

  // ========== FORM START FUNCTIONS ==========
  const startServiceBooking = () => {
    setActiveForm('service_booking');
    setBookingStep('select_service');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `📋 **Great! Let's book a service.**\n\nPlease select your preferred service from the options below:` }
    ]);
  };

  const startDemoBooking = () => {
    setActiveForm('demo_booking');
    setDemoStep('select_service');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `📅 **Perfect! Let's schedule your demo.**\n\nPlease select which service demo you'd like to see:` }
    ]);
  };

  const startContact = () => {
    setActiveForm('contact');
    setContactStep('select_type');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `📧 **I'll help you contact our team.**\n\nPlease select what you'd like to contact us about:` }
    ]);
  };

  const startSupport = () => {
    setActiveForm('support');
    setSupportStep('select_category');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `🛠️ **I'll help you create a support ticket.**\n\nPlease select the category that best describes your issue:` }
    ]);
  };

  // ========== SERVICE BOOKING HANDLERS ==========
  const handleServiceSelect = (service: ServiceType) => {
    const serviceNames = {
      'digital_marketing': 'Digital Marketing Service',
      'automation': 'Automation Service',
      'website_development': 'Website Development Service'
    };
    
    setBookingData(prev => ({ ...prev, service }));
    setBookingStep('collect_details');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `🎯 **Perfect choice!** You selected **${serviceNames[service]}**.\n\nNow let's get your details:` }
    ]);
  };

  const handleBookingDetailsSubmit = (details: any) => {
    setBookingData(prev => ({ ...prev, ...details }));
    setBookingStep('project_info');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `✅ **Details saved!**\n\nNow please tell us about your project:` }
    ]);
  };

  const handleProjectInfoSubmit = (projectInfo: any) => {
    setBookingData(prev => ({ ...prev, projectInfo }));
    setBookingStep('confirm_booking');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `📋 **Project info saved!**\n\nPlease review your booking details below:` }
    ]);
  };

  const handleBookingConfirm = async () => {
    setLoading(true);
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `⏳ **Processing your service booking...**` }
    ]);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'opsoraagency@gmail.com',
          subject: `New Service Booking: ${bookingData.service}`,
          html: `
            <h2>New Service Booking Request</h2>
            <h3>Contact Information</h3>
            <p><strong>Name:</strong> ${bookingData.name}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${bookingData.company || 'Not provided'}</p>
            <p><strong>Job Title:</strong> ${bookingData.jobTitle || 'Not provided'}</p>
            <p><strong>Industry:</strong> ${bookingData.industry === 'Other' ? bookingData.otherIndustry : bookingData.industry || 'Not specified'}</p>
            <p><strong>Preferred Contact:</strong> ${bookingData.preferredContact}</p>
            
            <h3>Service Details</h3>
            <p><strong>Main Service:</strong> ${bookingData.service}</p>
            <p><strong>Sub-Services Selected:</strong> ${bookingData.projectInfo?.subServices?.length > 0 ? bookingData.projectInfo.subServices.join(', ') : 'None selected'}</p>
            <p><strong>Budget:</strong> ${bookingData.projectInfo?.budget || 'Not specified'}</p>
            <p><strong>Timeline:</strong> ${bookingData.projectInfo?.timeline || 'Not specified'}</p>
            
            <h3>Project Information</h3>
            <p><strong>Current Challenges:</strong> ${bookingData.projectInfo?.currentChallenges || 'Not provided'}</p>
            <p><strong>Project Goals:</strong> ${bookingData.projectInfo?.projectGoals || 'Not provided'}</p>
            <p><strong>Requirements:</strong> ${bookingData.projectInfo?.requirements || 'No additional requirements provided'}</p>
            
            <hr>
            <p><em>This message was sent from the Opsora Agency chatbot service booking form.</em></p>
            <p><strong>Client Email for reply:</strong> ${bookingData.email}</p>
          `,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, 
          { role: 'assistant', content: `✅ **Service Booking Confirmed Successfully!**\n\n🎯 **Reference ID:** #${Math.floor(100000 + Math.random() * 900000)}\n📧 **Confirmation sent to:** ${bookingData.email}\n👥 **Our team will contact you within 24 hours**\n\nThank you for choosing Opsora! 🚀` }
        ]);
      } else {
        throw new Error(responseData.error || 'Booking failed');
      }
    } catch (error) {
      setMessages(prev => [...prev, 
        { role: 'assistant', content: `❌ **Booking submission failed.**\n\nPlease contact us directly:\n📧 **Email:** opsoraagency@gmail.com\n📞 **Phone:** +91 8401765505\n\nWe'll help you complete your booking manually.` }
      ]);
    } finally {
      setLoading(false);
      resetActiveForm();
    }
  };

  // ========== DEMO BOOKING HANDLERS ==========
  const handleDemoServiceSelect = (service: ServiceType) => {
    const serviceNames = {
      'digital_marketing': 'Digital Marketing Demo',
      'automation': 'Automation / AI-Agents Demo',
      'website_development': 'Website Development Demo'
    };
    
    setDemoData(prev => ({ ...prev, service }));
    setDemoStep('collect_details');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `🎯 **Great choice!** You selected **${serviceNames[service]}**.\n\nNow let's get your details:` }
    ]);
  };

  const handleDemoDetailsSubmit = (details: any) => {
    setDemoData(prev => ({ ...prev, ...details }));
    setDemoStep('demo_schedule');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `✅ **Details saved!**\n\nNow please schedule your demo:` }
    ]);
  };

  const handleDemoScheduleSubmit = (schedule: any) => {
    setDemoData(prev => ({ ...prev, schedule }));
    setDemoStep('confirm_booking');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `📅 **Schedule saved!**\n\nPlease review your demo booking details below:` }
    ]);
  };

  const handleDemoConfirm = async () => {
    setLoading(true);
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `⏳ **Processing your demo booking...**` }
    ]);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'opsoraagency@gmail.com',
          subject: `New Demo Booking: ${demoData.service}`,
          html: `
            <h2>New Demo Booking Request</h2>
            <h3>Contact Information</h3>
            <p><strong>Name:</strong> ${demoData.name}</p>
            <p><strong>Email:</strong> ${demoData.email}</p>
            <p><strong>Phone:</strong> ${demoData.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${demoData.company || 'Not provided'}</p>
            <p><strong>Job Title:</strong> ${demoData.jobTitle || 'Not provided'}</p>
            <p><strong>Industry:</strong> ${demoData.industry === 'Other' ? demoData.otherIndustry : demoData.industry || 'Not specified'}</p>
            <p><strong>Preferred Contact:</strong> ${demoData.preferredContact}</p>
            
            <h3>Demo Schedule</h3>
            <p><strong>Demo Date:</strong> ${demoData.schedule?.demoDate || 'Not specified'}</p>
            <p><strong>Demo Time:</strong> ${demoData.schedule?.demoTime || 'Not specified'}</p>
            <p><strong>Timezone:</strong> ${demoData.schedule?.timezone}</p>
            <p><strong>Number of Attendees:</strong> ${demoData.schedule?.attendees}</p>
            <p><strong>Demo Type:</strong> ${demoData.schedule?.demoType}</p>
            <p><strong>Platform:</strong> ${demoData.schedule?.platform}</p>
            
            <h3>Demo Details</h3>
            <p><strong>Main Service:</strong> ${demoData.service}</p>
            <p><strong>Sub-Services Selected:</strong> ${demoData.schedule?.subServices?.length > 0 ? demoData.schedule.subServices.join(', ') : 'None selected'}</p>
            
            <h3>Demo Preparation</h3>
            <p><strong>Current Challenges:</strong> ${demoData.schedule?.currentChallenges || 'Not provided'}</p>
            <p><strong>Demo Goals:</strong> ${demoData.schedule?.demoGoals || 'Not provided'}</p>
            <p><strong>Special Requirements:</strong> ${demoData.schedule?.specialRequirements || 'No special requirements'}</p>
            
            <hr>
            <p><em>This message was sent from the Opsora Agency chatbot demo booking form.</em></p>
            <p><strong>Client Email for reply:</strong> ${demoData.email}</p>
          `,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, 
          { role: 'assistant', content: `✅ **Demo Booking Confirmed Successfully!**\n\n🎯 **Reference ID:** #${Math.floor(100000 + Math.random() * 900000)}\n📧 **Calendar invitation will be sent to:** ${demoData.email}\n👥 **Our team will confirm your demo within 2 hours**\n\nThank you for choosing Opsora! 🚀` }
        ]);
      } else {
        throw new Error(responseData.error || 'Booking failed');
      }
    } catch (error) {
      setMessages(prev => [...prev, 
        { role: 'assistant', content: `❌ **Demo booking submission failed.**\n\nPlease contact us directly:\n📧 **Email:** opsoraagency@gmail.com\n📞 **Phone:** +91 8401765505\n\nWe'll help you schedule your demo manually.` }
      ]);
    } finally {
      setLoading(false);
      resetActiveForm();
    }
  };

  // ========== CONTACT FORM HANDLERS ==========
  const handleContactTypeSelect = (type: ContactType) => {
    const typeNames = {
      'general_inquiry': 'General Inquiry',
      'pricing': 'Pricing & Quotes',
      'technical': 'Technical Question',
      'partnership': 'Partnership',
      'other': 'Other Question'
    };
    
    setContactData(prev => ({ ...prev, type }));
    setContactStep('collect_details');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `📝 **Got it!** You selected **${typeNames[type]}**.\n\nNow let's get your details and message:` }
    ]);
  };

  const handleContactDetailsSubmit = (details: any) => {
    setContactData(prev => ({ ...prev, ...details }));
    setContactStep('confirm_submission');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `✅ **Details saved!**\n\nPlease review your message before sending:` }
    ]);
  };

  const handleContactConfirm = async () => {
    setLoading(true);
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `⏳ **Sending your message...**` }
    ]);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'opsoraagency@gmail.com',
          subject: `New Contact: ${contactData.subject}`,
          html: `
            <h2>New Contact Message</h2>
            <h3>Contact Information</h3>
            <p><strong>Type:</strong> ${contactData.type}</p>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${contactData.company || 'Not provided'}</p>
            <p><strong>Preferred Contact:</strong> ${contactData.preferredContact}</p>
            
            <h3>Message Details</h3>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Message:</strong> ${contactData.message}</p>
            
            <hr>
            <p><em>This message was sent from the Opsora Agency chatbot contact form.</em></p>
            <p><strong>Client Email for reply:</strong> ${contactData.email}</p>
          `,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, 
          { role: 'assistant', content: `✅ **Message Sent Successfully!**\n\n📧 **Confirmation sent to:** ${contactData.email}\n⏱️ **We aim to respond within 24 hours**\n\nThank you for contacting Opsora! 🚀` }
        ]);
      } else {
        throw new Error(responseData.error || 'Message failed');
      }
    } catch (error) {
      setMessages(prev => [...prev, 
        { role: 'assistant', content: `❌ **Message submission failed.**\n\nPlease contact us directly:\n📧 **Email:** opsoraagency@gmail.com\n📞 **Phone:** +91 8401765505` }
      ]);
    } finally {
      setLoading(false);
      resetActiveForm();
    }
  };

  // ========== SUPPORT FORM HANDLERS ==========
  const handleSupportCategorySelect = (category: SupportCategory) => {
    const categoryNames = {
      'account': 'Account Issues',
      'billing': 'Billing & Payments',
      'technical': 'Technical Problems',
      'feature': 'Feature Requests',
      'security': 'Account Security',
      'api': 'API & Integration',
      'bug': 'Bug Report',
      'general': 'General Support'
    };
    
    setSupportData(prev => ({ ...prev, category }));
    setSupportStep('collect_details');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `🛠️ **Got it!** You selected **${categoryNames[category]}**.\n\nNow let's get your details:` }
    ]);
  };

  const handleSupportDetailsSubmit = (details: any) => {
    setSupportData(prev => ({ ...prev, ...details }));
    setSupportStep('issue_details');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `✅ **Details saved!**\n\nNow please describe your issue in detail:` }
    ]);
  };

  const handleSupportIssueSubmit = (issue: any) => {
    setSupportData(prev => ({ ...prev, ...issue }));
    setSupportStep('confirm_submission');
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `📋 **Issue details saved!**\n\nPlease review your support ticket below:` }
    ]);
  };

  const handleSupportConfirm = async () => {
    setLoading(true);
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `⏳ **Submitting your support ticket...**` }
    ]);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'opsoraagency@gmail.com',
          subject: `[${supportData.priority.toUpperCase()}] Support Ticket: ${supportData.subject}`,
          html: `
            <h2>New Support Ticket</h2>
            <h3>Ticket Information</h3>
            <p><strong>Priority:</strong> ${supportData.priority.toUpperCase()}</p>
            <p><strong>Category:</strong> ${supportData.category}</p>
            <p><strong>Subject:</strong> ${supportData.subject}</p>
            
            <h3>Contact Information</h3>
            <p><strong>Name:</strong> ${supportData.name}</p>
            <p><strong>Email:</strong> ${supportData.email}</p>
            <p><strong>Phone:</strong> ${supportData.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${supportData.company || 'Not provided'}</p>
            
            <h3>Issue Details</h3>
            <p><strong>Message:</strong> ${supportData.message}</p>
            ${supportData.errorMessages ? `<p><strong>Error Messages:</strong> ${supportData.errorMessages}</p>` : ''}
            ${supportData.stepsToReproduce ? `<p><strong>Steps to Reproduce:</strong> ${supportData.stepsToReproduce}</p>` : ''}
            ${supportData.browserDeviceInfo ? `<p><strong>Browser/Device:</strong> ${supportData.browserDeviceInfo}</p>` : ''}
            ${supportData.accountOrderNumbers ? `<p><strong>Account/Order #:</strong> ${supportData.accountOrderNumbers}</p>` : ''}
            
            <hr>
            <p><em>This message was sent from the Opsora Agency chatbot support form.</em></p>
            <p><strong>Client Email for reply:</strong> ${supportData.email}</p>
          `,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        const ticketId = Math.floor(100000 + Math.random() * 900000);
        setMessages(prev => [...prev, 
          { role: 'assistant', content: `✅ **Support Ticket Submitted Successfully!**\n\n🆔 **Ticket ID:** #${ticketId}\n📧 **Confirmation sent to:** ${supportData.email}\n⏱️ **Expected response time:** ${supportData.priority === 'urgent' ? '2-4 hours' : supportData.priority === 'high' ? '4-8 hours' : supportData.priority === 'medium' ? '24 hours' : '48 hours'}\n\nOur support team will contact you soon! 🛠️` }
        ]);
      } else {
        throw new Error(responseData.error || 'Ticket failed');
      }
    } catch (error) {
      setMessages(prev => [...prev, 
        { role: 'assistant', content: `❌ **Ticket submission failed.**\n\nPlease contact us directly:\n📧 **Email:** opsoraagency@gmail.com\n📞 **Phone:** +91 8401765505` }
      ]);
    } finally {
      setLoading(false);
      resetActiveForm();
    }
  };

  // ========== FORM CANCEL HANDLERS ==========
  const handleFormCancel = () => {
    setMessages(prev => [...prev, 
      { role: 'assistant', content: `Form cancelled. How else can I help you today?` }
    ]);
    resetActiveForm();
  };

  const resetActiveForm = () => {
    setActiveForm(null);
    setBookingStep('select_service');
    setDemoStep('select_service');
    setContactStep('select_type');
    setSupportStep('select_category');
    
    // Reset all form data
    setBookingData({
      service: '',
      name: '',
      email: '',
      company: '',
      phone: '',
      jobTitle: '',
      industry: '',
      otherIndustry: '',
      referralSource: '',
      preferredContact: 'email',
      requirements: '',
      projectInfo: null,
    });
    
    setDemoData({
      service: '',
      name: '',
      email: '',
      company: '',
      phone: '',
      jobTitle: '',
      industry: '',
      otherIndustry: '',
      referralSource: '',
      preferredContact: 'email',
      schedule: null,
    });
    
    setContactData({
      type: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
      preferredContact: 'email',
    });
    
    setSupportData({
      category: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      priority: 'medium',
      message: '',
      errorMessages: '',
      stepsToReproduce: '',
      browserDeviceInfo: '',
      accountOrderNumbers: '',
    });
  };

  // ========== SEND MESSAGE ==========
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const userMsg = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const lowerMsg = userMessage.toLowerCase();

    // Check form intents
    if (lowerMsg.includes('book service') || lowerMsg.includes('service booking') || lowerMsg.includes('hire service')) {
      startServiceBooking();
      setLoading(false);
      textareaRef.current?.focus();
      return;
    }

    if (lowerMsg.includes('book demo') || lowerMsg.includes('schedule demo') || lowerMsg.includes('demo booking')) {
      startDemoBooking();
      setLoading(false);
      textareaRef.current?.focus();
      return;
    }

    if (lowerMsg.includes('contact') || lowerMsg.includes('message') || lowerMsg.includes('email') || lowerMsg.includes('get in touch')) {
      startContact();
      setLoading(false);
      textareaRef.current?.focus();
      return;
    }

    if (lowerMsg.includes('support') || lowerMsg.includes('help') || lowerMsg.includes('ticket') || lowerMsg.includes('issue') || lowerMsg.includes('problem')) {
      startSupport();
      setLoading(false);
      textareaRef.current?.focus();
      return;
    }

    // Check smart commands
    const smartResponse = processSmartCommand(userMessage);
    if (smartResponse) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: smartResponse }]);
        setLoading(false);
        textareaRef.current?.focus();
      }, 300);
      return;
    }

    // Send to AI
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, provider: 'groq' }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.content }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: `I apologize for the issue. Please contact us directly:\n📧 Email: opsoraagency@gmail.com\n📞 Phone: +91 8401765505` }
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: `🤖 **Hello! I'm Opsora AI Assistant**\n\nI can help you with:\n\n📅 **Book Services/Demos**\n💰 **Get Pricing & Quotes**\n📞 **Contact Our Team**\n🚀 **Learn About Our Services**\n🛠️ **Get Support**\n❓ **Answer Any Questions**\n\n*Try saying: "book demo", "book service", "contact", "support", "pricing", or ask anything!*` 
      }
    ]);
    resetActiveForm();
    textareaRef.current?.focus();
  };

  return (
    <>
      {/* Bookmark Button */}
      <div className={`chatbot-bookmark ${isOpen ? 'open' : ''}`}
           onClick={() => setIsOpen(!isOpen)}
           title={isOpen ? 'Close Chat (Esc)' : 'Open AI Assistant (Ctrl+/)'}>
        
        <div className="keyboard-hint">
          Press <kbd>Ctrl</kbd>+<kbd>/</kbd>
        </div>
        
        <div className="bookmark-logo-container">
          {theme === 'light' ? (
            <div className="bookmark-logo-light">
              <Image 
                src="/images/chatbot/chatbotop-both.svg" 
                alt="Opsora Logo" 
                width={30} 
                height={30} 
                priority
              />
            </div>
          ) : (
            <div className="bookmark-logo-dark">
              <Image 
                src="/images/chatbot/chatbotop-dark.svg" 
                alt="Opsora Logo" 
                width={30} 
                height={30} 
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className={`chatbot-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {/* Left side: New Chat button */}
          <div className="header-left">
            <button onClick={clearChat} className="action-btn" title="New chat" disabled={loading || activeForm !== null}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          
          {/* Center: Logo */}
          <div className="header-center">
            <div className="header-logo">
              <div className="logo-light">
                <Image src="/images/logo/logo-2.svg" alt="Opsora Logo" width={100} height={28} className="logo-img" />
              </div>
              <div className="logo-dark">
                <Image src="/images/logo/logo.svg" alt="Opsora Logo" width={100} height={28} className="logo-img" />
              </div>
            </div>
          </div>
          
          {/* Right side: Close button */}
          <div className="header-right">
            <button onClick={() => setIsOpen(false)} className="close-btn" title="Close (Esc)" disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="sidebar-messages">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} theme={theme} />
          ))}
          
          {/* Render appropriate form based on activeForm */}
          {activeForm === 'service_booking' && (
            <ChatbotServiceBookingForm
              step={bookingStep}
              bookingData={bookingData}
              onServiceSelect={handleServiceSelect}
              onDetailsSubmit={handleBookingDetailsSubmit}
              onProjectInfoSubmit={handleProjectInfoSubmit}
              onConfirm={handleBookingConfirm}
              onCancel={handleFormCancel}
              loading={loading}
              theme={theme}
            />
          )}
          
          {activeForm === 'demo_booking' && (
            <ChatbotDemoBookingForm
              step={demoStep}
              bookingData={demoData}
              onServiceSelect={handleDemoServiceSelect}
              onDetailsSubmit={handleDemoDetailsSubmit}
              onScheduleSubmit={handleDemoScheduleSubmit}
              onConfirm={handleDemoConfirm}
              onCancel={handleFormCancel}
              loading={loading}
              theme={theme}
            />
          )}
          
          {activeForm === 'contact' && (
            <ChatbotContactForm
              step={contactStep}
              contactData={contactData}
              onTypeSelect={handleContactTypeSelect}
              onDetailsSubmit={handleContactDetailsSubmit}
              onConfirm={handleContactConfirm}
              onCancel={handleFormCancel}
              loading={loading}
              theme={theme}
            />
          )}
          
          {activeForm === 'support' && (
            <ChatbotSupportForm
              step={supportStep}
              supportData={supportData}
              onCategorySelect={handleSupportCategorySelect}
              onDetailsSubmit={handleSupportDetailsSubmit}
              onIssueSubmit={handleSupportIssueSubmit}
              onConfirm={handleSupportConfirm}
              onCancel={handleFormCancel}
              loading={loading}
              theme={theme}
            />
          )}
          
          {loading && activeForm === null && (
            <div className="message assistant typing">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="sidebar-input">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={activeForm === null 
                ? "Ask Anything..."
                : "Continue typing or use the form above..."}
              disabled={loading || activeForm !== null}
              rows={1}
              autoFocus
            />
            <button 
              onClick={sendMessage} 
              disabled={!input.trim() || loading || activeForm !== null} 
              className="send-btn" 
              title="Send message (Enter)"
            >
              {loading ? <div className="spinner"></div> : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                </svg>
              )}
            </button>
          </div>
          <div className="input-hint">
            {activeForm === null && "Try: 'book service', 'book demo', 'contact', 'support'"}
            {activeForm !== null && "Fill the form above to complete your request"}
          </div>
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}
