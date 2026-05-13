"use client";

import React from "react";

const Steps = () => {
 const steps = [
  {
    title: "Technical Discovery",
    description: "We perform a deep-dive audit of your current digital infrastructure and manual bottlenecks."
  },
  {
    title: "Strategic Architecture",
    description: "Designing a custom blueprint that maps AI automation to your specific business KPIs."
  },
  {
    title: "System Integration",
    description: "Developing the technical logic and connecting AI agents to your existing CRM and tools."
  },
  {
    title: "Solution Deployment",
    description: "Launching your high-performance assets and automated funnels into the live market."
  },
  {
    title: "Data-Driven Tuning",
    description: "Using real-world interaction data to refine AI responses and optimize conversion rates."
  },
  {
    title: "Precision Scaling",
    description: "Providing transparent ROI reports and expanding the systems to drive long-term growth."
  }
];
 

  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Our proven 6-step digital marketing process
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Waving Connecting Line */}
          <div className="absolute left-0 right-0 top-1/2 hidden -translate-y-1/2 md:block">
            <div className="relative h-1 overflow-hidden">
              {/* Wave SVG */}
              <svg className="absolute top-0 left-0 w-full h-6" viewBox="0 0 1000 10" preserveAspectRatio="none">
                <path 
                  d="M0,5 Q250,10 500,5 T1000,5" 
                  stroke="url(#wave-gradient)" 
                  strokeWidth="2" 
                  fill="none"
                  className="animate-wave"
                />
                <defs>
                  <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4A6CF7" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#4A6CF7" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#4A6CF7" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative group"
              >
                {/* Floating Card */}
                <div className="
                  relative z-10 
                  animate-float
                  bg-white dark:bg-gray-800 
                  rounded-xl 
                  p-5 
                  shadow-lg 
                  border border-gray-200 dark:border-gray-700
                  hover:shadow-xl 
                  transition-all duration-300
                  hover:-translate-y-2
                  h-full
                ">
                  {/* Step Number */}
                  <div className="
                    absolute -top-3 -left-3
                    h-8 w-8 
                    rounded-full 
                    bg-primary 
                    flex items-center justify-center
                    text-white font-bold text-sm
                    shadow-lg
                  ">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="pt-2">
                    <h3 className="
                      text-lg font-semibold 
                      text-gray-900 dark:text-white
                      mb-2
                    ">
                      {step.title}
                    </h3>
                    <p className="
                      text-sm 
                      text-gray-600 dark:text-gray-400
                      leading-relaxed
                    ">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Mobile Connector Line */}
                {index < steps.length - 1 && (
                  <div className="
                    absolute 
                    -bottom-8 left-1/2 
                    h-8 w-0.5 
                    bg-gradient-to-b from-primary/30 to-transparent
                    hidden md:block lg:hidden
                  "></div>
                )}

                {/* Tablet Connector Line */}
                {index < steps.length - 1 && index % 3 !== 2 && (
                  <div className="
                    absolute 
                    -right-4 top-1/2 
                    h-0.5 w-8 
                    bg-gradient-to-r from-primary/30 to-transparent
                    hidden lg:block
                  "></div>
                )}
              </div>
            ))}
          </div>
        </div>


{/* Video */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div className="relative pb-[56.25%] h-0">
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/_A900SVcrNU?si=hLOKcrvjb40_25hy" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
      </div>

       
        {/* CTA */}
        {/* CTA */}
<div className="mt-16 text-center">
  <a 
    href="/contact"
    className="
      inline-block
      rounded-lg 
      bg-primary 
      px-8 py-3 
      font-semibold text-white 
      transition-all 
      hover:bg-primary/90 
      hover:shadow-lg
      hover:-translate-y-0.5
      active:scale-95
    "
  >
    Start Your Success Journey
  </a>
</div>
      </div>
    </section>
  );
};

export default Steps;
