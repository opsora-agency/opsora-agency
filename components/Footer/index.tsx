"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const phoneNumber = "+91 8401765505";
  const email = "opsoraagency@gmail.com";
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Footer/index.tsx updates
const handleNewsletterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) return;

  setIsSubmitting(true);
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: newsletterEmail,
        name: "Footer Subscriber" // Default name since footer has no name input
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      setIsSubmitted(true);
      setNewsletterEmail("");
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  } catch (error) {
    console.error("Footer Subscription error:", error);
  } finally {
    setIsSubmitting(false);
  }
};




  return (
    <>
      <footer
        className="wow fadeInUp relative z-10 bg-white pt-16 dark:bg-gray-dark md:pt-20 lg:pt-24"
        data-wow-delay=".1s"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            {/* Company Info Section */}
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link href="/" className="mb-8 inline-block">
                  <Image
                    src={getImagePath("/images/logo/logo-2.svg")}
                    alt="logo"
                    className="w-full dark:hidden"
                    width={100}
                    height={10}
                  />
                  <Image
                    src={getImagePath("/images/logo/logo.svg")}
                    alt="logo"
                    className="hidden w-full dark:block"
                    width={100}
                    height={10}
                  />
                </Link>
                <p className="mb-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  Transforming ideas into exceptional digital experiences. We build solutions that drive growth and innovation.
                </p>
                
                {/* Contact Info */}
                <div className="mb-8 space-y-4">
                  <div className="group flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <a 
                      href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                      className="text-base font-medium text-black hover:text-primary dark:text-white dark:hover:text-primary transition-colors duration-300"
                    >
                      {phoneNumber}
                    </a>
                  </div>

                  <div className="group flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <a 
                      href={`mailto:${email}`}
                      className="text-base font-medium text-black hover:text-primary dark:text-white dark:hover:text-primary transition-colors duration-300"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Social Links - Updated icons */}
                <div className="flex items-center space-x-5">
                  {[
                    { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/opsora_agency/" },
                    { icon: LinkedInIcon, label: "LinkedIn", href: "https://www.linkedin.com/company/opsora-agency/" },
                    { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/share/1Gf63Rkgxk/" },
                    { icon: TwitterIcon, label: "Twitter", href: "https://x.com/OpsoraAgency" }, 
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary transform hover:-translate-y-1 transition-all duration-300"
                      onClick={(e) => e.preventDefault()}
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
           <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
  <div className="mb-12 lg:mb-16">

    
    <h2 className="mb-6 text-lg font-semibold text-black dark:text-white">
      Quick Links
    </h2>
    <ul className="space-y-3">
      {[
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Consultation", href: "/contact" },
        { label: "Contact", href: "/contact/Contact-&-Support" },
        { label: "Support", href: "/contact/Contact-&-Support/support" },
      ].map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary transition-colors duration-300"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>

    
</div>


            {/* Services */}
{/* Services */}
<div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
  <div className="mb-12 lg:mb-16">

     <div className="mb-12 lg:mb-16">
    <h2 className="mb-6 text-lg font-semibold text-black dark:text-white">
      Legal
    </h2>
    <ul className="space-y-3">
      {[
        { label: "Privacy Policy", href: "/Consent/PrivacyPolicy" },
        { label: "Terms of Service", href: "/Consent/TermsOfService" },
        { label: "Terms and Conditions", href: "/Consent/TermsAndConditions" },
        { label: "Cookie Policy", href: "/Consent/CookiePolicy" },
        { label: "Disclaimer", href: "/Consent/Disclaimer" },
      ].map((service) => (
        <li key={service.label}>
          <a
            href={service.href}
            className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary transition-colors duration-300"
           
          >
            {service.label}
          </a>
        </li>
      ))}
    </ul>
  </div>

  </div>
  
</div>

            {/* Newsletter - Now Functional */}
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-6 text-lg font-semibold text-black dark:text-white">
                  Stay Updated
                </h2>
                <p className="mb-4 text-sm text-body-color dark:text-body-color-dark">
                  Subscribe to our newsletter for the latest updates.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your email"
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 pr-12 text-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !newsletterEmail.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary p-2 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {isSubmitted && (
                    <div className="rounded-lg bg-green-100 px-4 py-2 dark:bg-green-900/20">
                      <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Thank you! You're now subscribed.
                      </p>
                    </div>
                  )}
                </form>
                
                {/* Removed Business Hours section */}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
          
          {/* Bottom Bar */}
          <div className="py-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="mb-4 text-center text-sm text-body-color dark:text-white md:mb-0">
                © {new Date().getFullYear()} Opsora Agency. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <a
                  href="/Consent/PrivacyPolicy"
                  className="text-sm text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary transition-colors"
                  
                >
                  Privacy Policy
                </a>

                
                <a
                  href="/Consent/CookiePolicy"
                  className="text-sm text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary transition-colors"
                >
                  Cookie Policy
                </a>

                
               

                
              </div>
            </div>
          </div>
        </div>

        {/* Decorative SVG Elements */}
        <div className="absolute right-0 top-14 z-[-1] opacity-50">
          <svg width="55" height="99" viewBox="0 0 55 99" fill="none">
            <circle cx="49.5" cy="49.5" r="49.5" fill="url(#footer-gradient)" />
          </svg>
        </div>
        <div className="absolute bottom-24 left-0 z-[-1] opacity-30">
          <svg width="79" height="94" viewBox="0 0 79 94" fill="none">
            <rect x="-41" y="26.9426" width="66.6675" height="66.6675" fill="url(#footer-gradient-2)" />
          </svg>
        </div>
      </footer>
    </>
  );
};

// Updated Social Icons Components
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default Footer;
