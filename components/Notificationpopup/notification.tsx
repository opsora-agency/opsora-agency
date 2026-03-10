"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NotificationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showTemporaryNote, setShowTemporaryNote] = useState(false);

  // Sample notifications with icons replaced
  const notifications = [
    {
      id: 1,
      type: "offer",
      icon: "🎉",
      title: "20% OFF on AI Chatbots",
      message: "Launch special! Get 20% discount on all AI chatbot packages.",
      action: "Claim Offer →",
      link: "/contact"
    },
    {
      id: 2,
      type: "news",
      icon: "🚀",
      title: "New Service Launch",
      message: "Built custom websites. Book a demo today!",
      action: "Learn More →",
      link: "/services/web-development-service/web-development-package"
    },
    {
      id: 3,
      type: "update",
      icon: "✨",
      title: "Platform Update",
      message: "AI response time improved by 40%. Experience faster replies now!",
      action: "Check Update →",
      link: "/services/automation-services"
    },
    {
      id: 4,
      type: "promo",
      icon: "💼",
      title: "Refer & Earn",
      message: "Refer a friend and get 15% commission on their first purchase.",
      action: "Refer Now →",
      link: "/contact"
    },
    {
      id: 5,
      type: "event",
      icon: "📊",
      title: "Webinar: AI for Business",
      message: "Join our free webinar on March 20th. Register now!",
      action: "Register →",
      link: "/webinar"
    }
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if consent popup is open
  useEffect(() => {
    const checkConsentPopup = () => {
      const consentElement = document.querySelector('[class*="ConsentPopup"]') || 
                            document.querySelector('.fixed.inset-x-0.bottom-0');
      setIsConsentOpen(!!consentElement);
    };

    checkConsentPopup();
    const observer = new MutationObserver(checkConsentPopup);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const unreadCount = notifications.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // On mobile, start minimized
      if (window.innerWidth < 640) {
        setIsMinimized(true);
        // Show temporary note after popup becomes visible
        setTimeout(() => {
          setShowTemporaryNote(true);
          // Hide after 5 seconds
          setTimeout(() => {
            setShowTemporaryNote(false);
          }, 5000);
        }, 500);
      } else {
        setIsMinimized(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePrev = () => {
    setCurrentNotification((prev) => 
      prev === 0 ? notifications.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentNotification((prev) => (prev + 1) % notifications.length);
  };

  const handleAction = (link: string) => {
    window.open(link, '_blank');
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
    // Hide temporary note when expanded
    setShowTemporaryNote(false);
  };

  if (!isVisible || isConsentOpen) return null;

  const notification = notifications[currentNotification];

  return (
    <>
      {/* Notification Popup - Left Bottom Corner */}
      <div 
        className={`fixed left-2 sm:left-4 bottom-2 sm:bottom-4 z-[9999] ${
          isMinimized ? "w-10 sm:w-12" : 
          isMobile ? "w-[calc(100%-1rem)] max-h-[70vh] overflow-y-auto" : "w-[calc(100%-1rem)] sm:w-80"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Minimized State - Small Bell Button */}
        {isMinimized ? (
          <div className="relative">
            <button
              onClick={handleExpand}
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-900/20 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center cursor-pointer"
              aria-label="Open notifications"
            >
              {/* Bell Icon */}
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              
              {/* Red Notification Badge with Number */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] bg-red-500/90 backdrop-blur-xl border-2 border-white/30 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}

              {/* Hover Tooltip - Only show on non-mobile */}
              {!isMobile && (
                <span className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl text-white text-xs py-1 px-2 rounded whitespace-nowrap ${
                  isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                  {unreadCount} new notifications
                </span>
              )}
            </button>

            {/* Temporary Notification - Only on mobile */}
            {isMobile && showTemporaryNote && (
              <div className="absolute left-full ml-2 bottom-0 flex items-center animate-slideIn">
                {/* Arrow pointing to bell */}
                <div className="w-2 h-2 bg-white/20 backdrop-blur-xl transform rotate-45 border-l border-t border-white/20 -mr-1"></div>
                
                {/* Notification bubble */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 max-w-[200px] shadow-2xl">
                  <p className="text-white/90 text-[10px] leading-relaxed">
                    🔔 <span className="font-medium">New updates!</span> Click to see offers & news
                  </p>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/40 rounded-full animate-progress"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Expanded State - Notification Card */
          <div className="rounded-lg bg-blue-900/20 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Header - Sticky on mobile */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/10 bg-blue-900/30 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">{notification.icon}</span>
                <h3 className="text-white/90 text-xs sm:text-sm font-semibold">Latest Updates</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-[10px] sm:text-xs">
                  {currentNotification + 1}/{notifications.length}
                </span>
                <button
                  onClick={handleMinimize}
                  className="text-white/60 hover:text-white/90 p-1 hover:bg-white/10 rounded"
                  aria-label="Minimize"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - Scrollable on mobile */}
            <div className={`${isMobile ? 'max-h-[calc(80vh-100px)] overflow-y-auto' : ''} p-3 sm:p-4`}>
              {/* All notifications in a scrollable list on mobile */}
              {isMobile ? (
                <div className="space-y-4">
                  {notifications.map((notif, index) => (
                    <div key={notif.id} className={`pb-3 ${index !== notifications.length - 1 ? 'border-b border-white/10' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{notif.icon}</span>
                          <h4 className="text-white/90 font-medium text-xs">{notif.title}</h4>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                          {notif.type}
                        </span>
                      </div>
                      <p className="text-white/70 text-[11px] leading-relaxed mb-2 ml-7">
                        {notif.message}
                      </p>
                      <button
                        onClick={() => handleAction(notif.link)}
                        className="text-[11px] text-amber-300/90 hover:text-amber-200 font-medium flex items-center gap-1 ml-7"
                      >
                        {notif.action}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Desktop view - single notification */
                <>
                  <div className="mb-2 sm:mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white/90 font-medium text-xs sm:text-sm">{notification.title}</h4>
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                        {notification.type}
                      </span>
                    </div>
                    <p className="text-white/70 text-[11px] sm:text-xs leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleAction(notification.link)}
                    className="text-[11px] sm:text-xs text-amber-300/90 hover:text-amber-200 font-medium flex items-center gap-1"
                  >
                    {notification.action}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Navigation Arrows - Only show on desktop */}
            {!isMobile && (
              <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-t border-white/10 bg-white/5">
                <button
                  onClick={handlePrev}
                  className="text-white/60 hover:text-white/90 p-1 hover:bg-white/10 rounded disabled:opacity-50"
                  aria-label="Previous notification"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Progress Dots */}
                <div className="flex gap-1.5">
                  {notifications.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentNotification(index)}
                      className={`${
                        index === currentNotification 
                          ? 'w-4 sm:w-5 h-1.5 sm:h-2 bg-white/90 rounded-full' 
                          : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 rounded-full hover:bg-white/50'
                      }`}
                      aria-label={`Go to notification ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="text-white/60 hover:text-white/90 p-1 hover:bg-white/10 rounded disabled:opacity-50"
                  aria-label="Next notification"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </>
  );
};

export default NotificationPopup;
