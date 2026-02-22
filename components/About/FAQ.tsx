"use client";

import React, { useState } from "react";
import Link from "next/link";

const faqData = [
  {
    id: 1,
    question: "What digital solutions does Opsora Agency offer?",
    answer: "We provide a comprehensive range of services including performance-driven Digital Marketing, AI-powered Automation systems, 24/7 AI Chat Bots, and high-performance Web Development.",
  },
  {
    id: 2,
    question: "How long does it take to see results from your services?",
    answer: "Automation and AI systems often show efficiency gains within 2 weeks. For Digital Marketing, while initial data arrives quickly, we typically see significant scaling and ROI growth within 3 to 6 months.",
  },
  {
    id: 3,
    question: "Which digital service do I need for my business?",
    answer: "It depends on your goals. If you need more leads, start with Digital Marketing. If your team is overwhelmed by manual tasks or missed enquiries, our AI & Automation solutions are the priority.",
  },
  {
    id: 4,
    question: "Can you guarantee results with your strategies?",
    answer: "While no agency can control platform algorithms, we guarantee a data-backed, scientific approach to your growth. We focus on measurable KPIs like lead quality and operational time saved.",
  },
  {
    id: 5,
    question: "How do you measure the success of a campaign?",
    answer: "We use real-time AI dashboards to track ROI, cost-per-acquisition, and conversion rates, giving you full transparency into how every rupee spent is performing.",
  },
];

const FAQSection = () => {
  const [activeId, setActiveId] = useState<number | null>(1);

  return (
    <section className="bg-white py-16 dark:bg-gray-900 md:py-24 lg:py-32">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          
          {/* Left Side: Information & CTA */}
          <div className="w-full px-4 lg:w-2/5">
            <div className="mb-12 max-w-[400px] lg:mb-0">
              <h2 className="mb-6 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
                Frequently <br />
                <span className="text-primary">Asked Questions</span>
              </h2>
              <p className="mb-10 text-base leading-relaxed text-body-color dark:text-gray-400">
                We’ve answered the most common queries about our digital solutions to help you get started with confidence.
              </p>

              <div className="rounded-2xl bg-gray-50 p-8 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <h4 className="mb-2 text-xl font-bold text-black dark:text-white">Still have questions?</h4>
                <p className="mb-6 text-sm text-body-color">
                  Can’t find the answer you’re looking for? Please chat to our friendly team!
                </p>
                <Link href="/contact/Contact-&-Support">
                  <button className="rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 shadow-lg shadow-primary/20">
                    Get In Touch
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Accordion Questions */}
          <div className="w-full px-4 lg:w-3/5">
            <div className="lg:ml-8 space-y-4">
              {faqData.map((faq) => (
                <div 
                  key={faq.id} 
                  className={`rounded-xl border transition-all duration-300 ${
                    activeId === faq.id 
                    ? "border-primary/30 bg-gray-50 dark:bg-gray-800 shadow-md" 
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  <button
                    onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                    className="flex w-full items-center justify-between p-5 text-left sm:p-6"
                  >
                    <span className={`text-base font-bold sm:text-lg ${activeId === faq.id ? "text-primary" : "text-black dark:text-white"}`}>
                      {faq.question}
                    </span>
                    <span className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary transition-transform duration-300 ${activeId === faq.id ? "rotate-180 bg-primary text-white" : "text-primary"}`}>
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeId === faq.id ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="p-5 pt-0 text-base leading-relaxed text-body-color dark:text-gray-400 sm:p-6 sm:pt-0">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;
