'use client';
import { useState, FormEvent } from 'react';
import Link from "next/link";

const AboutPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // Core Values Section
  const coreValues = [
    {
      title: "Client-Centric Approach",
      description: "Your success is our success. We work collaboratively to understand your goals and deliver solutions that exceed expectations.",
      icon: "🎯"
    },
    {
      title: "Innovation First",
      description: "We stay ahead of industry trends and emerging technologies to provide cutting-edge solutions that give you a competitive edge.",
      icon: "💡"
    },
    {
      title: "Transparency & Trust",
      description: "Open communication, honest feedback, and clear processes form the foundation of every client relationship.",
      icon: "🤝"
    },
    {
      title: "Quality Excellence",
      description: "We never compromise on quality. Every project undergoes rigorous testing and refinement before delivery.",
      icon: "⭐"
    }
  ];

 // Services Section - Simplified with blue buttons
const mainServices = [
  {
    title: "Digital Marketing",
    description: "Data-driven strategies to increase visibility, drive targeted traffic, and convert leads into loyal customers.",
    readMoreLink: "/services/digital-marketing-services",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: "AI & Automation",
    description: "Transform your operations with intelligent AI agents and automation that work 24/7 to grow your business.",
    readMoreLink: "/services/automation-services",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  },
  {
    title: "Website Dev & Design",
    description: "Complete web solutions package: Design, development, hosting, security, SEO, and maintenance included.",
    readMoreLink: "/services/web-development-service",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  }
];

  // Process Steps
  const processSteps = [
    { step: "01", title: "Discovery", description: "Understanding your goals, audience, and requirements" },
    { step: "02", title: "Strategy", description: "Developing a comprehensive project roadmap" },
    { step: "03", title: "Design", description: "Creating intuitive and engaging user experiences" },
    { step: "04", title: "Development", description: "Building with clean, scalable code" },
    { step: "05", title: "Launch", description: "Deploying and ensuring smooth transition" },
    { step: "06", title: "Grow", description: "Ongoing optimization and support" }
  ];

  // Technologies
  const technologies = [
    "React", "Next.js", "Node.js", "Python", "Django", "Laravel",
    "WordPress", "Shopify", "Flutter", "React Native", "Swift", "Kotlin",
    "MongoDB", "PostgreSQL", "Firebase", "AWS", "Docker", "Figma",
    "Adobe XD", "Photoshop", "Illustrator", "After Effects"
  ];

  // Metrics
  const resultsMetrics = [
    { value: "50+", label: "Projects Completed", description: "Successful deliveries worldwide" },
    { value: "98%", label: "Client Satisfaction", description: "Based on post-project feedback" },
    { value: "4.9", label: "Client Rating", description: "Out of 5 stars" },
    { value: "24/7", label: "Support Available", description: "Round-the-clock assistance" }
  ];

  // Team Members
  const teamMembers = [
    {
      name: "Mauliksinh Ambaded",
      role: "Founder & CEO",
      experience: "8+ years in digital strategy and web development",
      bio: "Mauliksinh founded Opsora Agency with a vision to bridge the gap between creative design and technical excellence. His expertise spans full-stack development, AI integration, and business strategy.",
      linkedin: "https://www.linkedin.com/in/mauliksinh",
      initial: "M"
    },
    {
      name: "Pending",
      role: "Lead Developer",
      experience: "Expertise in React, Node.js, and cloud architecture",
      bio: "Our lead developer specializes in building scalable web applications and integrating complex backend systems.",
      linkedin: "#",
      initial: "P"
    },
    {
      name: "Pending",
      role: "Digital Marketing Head",
      experience: "Specializes in SEO, PPC, and social media strategy",
      bio: "Drives data-driven marketing campaigns that deliver measurable ROI for clients across industries.",
      linkedin: "#",
      initial: "P"
    },
    {
      name: "Pending",
      role: "UI/UX Design Lead",
      experience: "Creates intuitive and engaging user experiences",
      bio: "Focuses on human-centered design principles to create products users love.",
      linkedin: "#",
      initial: "P"
    }
  ];

  // Client Logos (placeholder data)
  const clientLogos = [
    { name: "Client 1", placeholder: true },
    { name: "Client 2", placeholder: true },
    { name: "Client 3", placeholder: true },
    { name: "Client 4", placeholder: true },
    { name: "Client 5", placeholder: true },
    { name: "Client 6", placeholder: true }
  ];

  // FAQ Items
  const faqItems = [
    {
      question: "What digital solutions does Opsora Agency offer?",
      answer: "We provide a comprehensive range of services including performance-driven Digital Marketing, AI-powered Automation systems, 24/7 AI Chat Bots, and high-performance Web Development."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on complexity. A standard website takes 4-8 weeks, while complex applications may take 3-6 months. We provide detailed timelines during our discovery phase."
    },
    {
      question: "Do you offer ongoing support after launch?",
      answer: "Yes! We provide comprehensive maintenance packages including security updates, performance monitoring, content updates, and technical support to ensure your digital presence remains optimal."
    },
    {
      question: "What is your pricing model?",
      answer: "We offer flexible pricing options including fixed-price projects, hourly rates, and monthly retainer packages. Each proposal is customized based on your specific requirements and scope."
    }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'opsora.services@gmail.com',
          subject: `About Page Inquiry - Project Discussion Request`,
          html: `
            <h2>New About Page Inquiry</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Company:</strong> ${data.company}</p>
            <p><strong>Project Type:</strong> ${data.projectType}</p>
            <p><strong>Budget Range:</strong> ${data.budget}</p>
            <p><strong>Message:</strong> ${data.message || 'No additional message provided'}</p>
            <p><em>Submitted from About Page</em></p>
          `,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you for reaching out! Our team will contact you within 24 hours to discuss your project.');
        setTimeout(() => {
          setSubmitStatus(null);
          setSubmitMessage('');
          (e.target as HTMLFormElement).reset();
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(responseData.error || 'Submission failed. Please email opsora.services@gmail.com directly.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                ABOUT OPSORA AGENCY
              </span>
            </div>
            
            <h1 className="mb-6 text-4xl font-light tracking-tight text-gray-900 dark:text-white md:text-6xl">
              We Craft Digital Experiences That
              <span className="block font-semibold text-primary mt-2">Drive Real Business Growth</span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Founded with a passion for digital innovation, Opsora Agency has grown into a trusted partner for businesses seeking to establish a powerful online presence.
            </p>
            
           
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
              Our Impact in Numbers
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {resultsMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {metric.label}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story & Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
                Our Story
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                From passion to purpose — the journey of Opsora Agency
              </p>
            </div>
            
            <div className="mb-12 text-center">
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Founded with a passion for digital innovation, Opsora Agency has grown into a trusted partner for businesses seeking to establish a powerful online presence. Our journey began with a simple belief: that exceptional design combined with strategic thinking can transform businesses and create lasting connections with audiences.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Today, we're proud to serve clients across industries, delivering custom digital solutions that blend creativity, technology, and data-driven insights. From startups to established enterprises, we help brands tell their stories, engage their audiences, and achieve measurable results.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                <div className="mb-3 text-3xl">🎯</div>
                <h3 className="mb-3 text-xl font-bold text-black dark:text-white">Our Mission</h3>
                <p className="text-body-color leading-relaxed">
                  To empower businesses with innovative digital solutions that drive growth, enhance customer experiences, and create sustainable value in an ever-evolving digital landscape.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                <div className="mb-3 text-3xl">👁️</div>
                <h3 className="mb-3 text-xl font-bold text-black dark:text-white">Our Vision</h3>
                <p className="text-body-color leading-relaxed">
                  To become a globally recognized digital agency known for transforming ideas into impactful digital experiences that resonate with audiences and deliver exceptional results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section - Detailed */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
                Meet the Founder
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                The vision behind Opsora Agency
              </p>
            </div>
            
            <div className="rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-5xl font-bold text-primary">
                  M
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-black dark:text-white">Mauliksinh Ambaded</h3>
                  <p className="mb-3 text-primary">Founder & CEO</p>
                  <p className="mb-4 text-body-color leading-relaxed">
                    With over 8 years of experience in digital strategy and web development, Mauliksinh founded Opsora Agency to bridge the gap between creative design and technical excellence. His expertise spans full-stack development, AI integration, and business strategy. He has successfully delivered 50+ projects across various industries including e-commerce, healthcare, education, and finance.
                  </p>
                  <p className="mb-4 text-body-color leading-relaxed">
                    Under his leadership, Opsora Agency has grown from a solo venture to a team of skilled professionals committed to delivering exceptional digital solutions. Mauliksinh holds certifications in cloud architecture, AI implementation, and advanced web technologies, ensuring the agency stays at the forefront of digital innovation.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/mauliksinh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>







      {/* Services Section - With Blue Buttons */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
                What We Do
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive digital solutions tailored to your business needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mainServices.map((service, index) => (
                <div
                  key={index}
                  className="group rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                >
                  <div className="mb-5 text-4xl">{service.icon}</div>
                  <h3 className="mb-3 text-xl font-medium text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                  <Link
                    href={service.readMoreLink}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                  >
                    View Details
                    <svg className="ml-2 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>









      {/* Core Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
                Our Core Values
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {coreValues.map((value, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <div className="mb-2 text-2xl">{value.icon}</div>
                  <h3 className="mb-2 font-semibold text-black dark:text-white">{value.title}</h3>
                  <p className="text-body-color text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
                Our 6-Step Process
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Structured approach to digital success
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl font-bold text-primary">{step.step}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section 
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
                Our Team
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Meet the experts behind our success
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {member.initial}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="mb-2 text-sm text-primary">{member.role}</p>
                  <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{member.experience}</p>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{member.bio}</p>
                  {member.linkedin !== "#" && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
*/}

      {/* Technology Stack - Scrolling Marquee */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
              Technology Stack
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Modern tools and technologies we leverage
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent dark:from-gray-900"></div>
            <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent dark:from-gray-900"></div>
            
            <div className="animate-scroll flex space-x-12 py-6">
              {[...technologies, ...technologies].map((tech, index) => (
                <div key={index} className="flex-shrink-0">
                  <div className="rounded-lg border border-gray-200 bg-white px-8 py-4 dark:border-gray-700 dark:bg-gray-800">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">{tech}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <style jsx>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-50% - 1.5rem)); }
              }
              .animate-scroll {
                animation: scroll 40s linear infinite;
                width: max-content;
              }
              .animate-scroll:hover { animation-play-state: paused; }
            `}</style>
          </div>
        </div>
      </section>

      {/* Clients Section 
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
              Trusted By Businesses Worldwide
            </h2>
            <p className="mb-12 text-gray-600 dark:text-gray-300">
              We've had the privilege of working with amazing companies
            </p>
            
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {clientLogos.map((client, index) => (
                <div key={index} className="flex items-center justify-center">
                  <div className="h-16 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{client.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>*/}







{/* Why Choose Opsora Section */}
<section className="py-20 bg-gray-50 dark:bg-gray-800/50">
  <div className="container mx-auto px-4">
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
          Why Choose Opsora Agency?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          We deliver excellence through expertise, innovation, and unwavering commitment
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Reason 1 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition-colors hover:border-primary/30 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Proven Track Record</h3>
          <p className="text-gray-600 dark:text-gray-400">
            50+ successful projects delivered across industries including e-commerce, healthcare, education, finance, and real estate. Our portfolio speaks for itself.
          </p>
        </div>

        {/* Reason 2 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition-colors hover:border-primary/30 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Expert Team</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Dedicated professionals with 8+ years of experience in web development, AI integration, digital marketing, and UI/UX design.
          </p>
        </div>

        {/* Reason 3 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition-colors hover:border-primary/30 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Tailored Solutions</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No one-size-fits-all approach. Every project is customized to your specific business needs, goals, and target audience.
          </p>
        </div>

        {/* Reason 4 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition-colors hover:border-primary/30 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636L9.172 14.828l-3.536-3.535" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Quality Assurance</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Rigorous testing across devices, browsers, and scenarios ensures bug-free, high-performance deliverables every time.
          </p>
        </div>

        {/* Reason 5 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition-colors hover:border-primary/30 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">On-Time Delivery</h3>
          <p className="text-gray-600 dark:text-gray-400">
            We respect your timeline. Our structured project management ensures milestones are met and deadlines are honored.
          </p>
        </div>

        {/* Reason 6 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition-colors hover:border-primary/30 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm0 0v4" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">24/7 Ongoing Support</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Post-launch maintenance, security updates, performance monitoring, and technical support whenever you need it.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-white transition-colors hover:bg-primary/90"
        >
          Start Your Project Today
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  </div>
</section>












      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Everything you need to know about working with us
              </p>
            </div>
            
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 bg-gray-900 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-light text-white md:text-4xl">
                Let's Discuss Your Project
              </h2>
              <p className="text-gray-300">
                Tell us about your vision, and we'll help bring it to life
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Full Name *</label>
                  <input type="text" name="name" required className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="John Smith" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Email Address *</label>
                  <input type="email" name="email" required className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="john@company.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Company Name</label>
                  <input type="text" name="company" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Your Company Name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Project Type *</label>
                  <select name="projectType" required className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="">Select project type</option>
                    <option value="website">Website Design & Development</option>
                    <option value="mobile">Mobile App Development</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="branding">Brand Identity</option>
                    <option value="ecommerce">E-Commerce Solutions</option>
                    <option value="seo">SEO & Analytics</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Budget Range</label>
                <select name="budget" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Select budget range</option>
                  <option value="under5k">Under $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Tell us about your project *</label>
                <textarea name="message" required rows={4} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Describe your goals, requirements, or any questions you have..."></textarea>
              </div>
              
              <div className="pt-4 text-center">
                {submitMessage && (
                  <div className={`mx-auto mb-8 max-w-2xl rounded border-l-4 p-4 ${
                    submitStatus === 'success' 
                      ? 'border-green-500 bg-green-900/20 text-green-300' 
                      : 'border-red-500 bg-red-900/20 text-red-300'
                  }`}>
                    {submitMessage}
                  </div>
                )}
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-lg bg-primary px-10 py-4 text-base font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-70">
                  {isSubmitting ? 'Processing...' : 'Send Message'}
                </button>
                <p className="mt-3 text-sm text-gray-400">We'll respond within 24 hours to discuss your project</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-light text-gray-900 dark:text-white md:text-4xl">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-gray-600 dark:text-gray-300">
              Partner with digital experts who understand how to build solutions that deliver exceptional results, drive growth, and create lasting value for your business.
            </p>
            
            <div className="mb-12">
              <a href="tel:+918401765505" className="inline-block text-2xl font-semibold text-primary hover:underline">
                +91 8401765505
              </a>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/book-service" className="inline-flex items-center justify-center rounded-lg bg-primary px-10 py-4 text-base font-medium text-white transition-colors hover:bg-primary/90">
                Book Service Now
              </Link>
              <a href="mailto:opsora.services@gmail.com?subject=Project%20Inquiry%20-%20About%20Page&body=Hello%20Opsora%20Team,%0A%0AI%27m%20interested%20in%20your%20digital%20services.%20Please%20send%20me%20more%20information.%0A%0AThanks," className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-transparent px-10 py-4 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                Email Us
              </a>
            </div>
            
            <div className="mt-12 border-t border-gray-200 pt-12 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-4">
                <div className="text-center">
                  <div className="mb-2 font-medium text-gray-900 dark:text-white">50+ Projects</div>
                  <div className="text-gray-500 dark:text-gray-400">Successfully delivered</div>
                </div>
                <div className="text-center">
                  <div className="mb-2 font-medium text-gray-900 dark:text-white">98% Satisfaction</div>
                  <div className="text-gray-500 dark:text-gray-400">Client happiness rate</div>
                </div>
                <div className="text-center">
                  <div className="mb-2 font-medium text-gray-900 dark:text-white">24/7 Support</div>
                  <div className="text-gray-500 dark:text-gray-400">Always here to help</div>
                </div>
                <div className="text-center">
                  <div className="mb-2 font-medium text-gray-900 dark:text-white">4.9 Rating</div>
                  <div className="text-gray-500 dark:text-gray-400">Client feedback score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
