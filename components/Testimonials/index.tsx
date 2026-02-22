"use client";

import { getImagePath } from "@/lib/utils";
import { Testimonial } from "@/types/testimonial";
import SectionTitle from "../Common/SectionTitle";
import SingleTestimonial from "./SingleTestimonial";
import { useEffect, useState } from "react";

const getTestimonialData = (): Testimonial[] => [
  {
    id: 1,
    name: "Manish Patel",
    designation: "From Anand, Gujarat",
    content: "Their marketing strategy completely changed our lead flow. In just one month, we saw a 200% jump in genuine enquiries from local clients.",
    image: getImagePath("/images/testimonials/profile.png"),
    star: 5,
  },
  {
    id: 2,
    name: "Hiren R. Parmar",
    designation: "From Borsad, Gujarat",
    content: "The AI partnership was a game-changer for us. They don't just provide technology; they actually understand how to automate a business for real growth.",
    image: getImagePath("/images/testimonials/profile.png"),
    star: 5,
  },
  {
    id: 3,
    name: "Chirag Solanki",
    designation: "From Borsad, Gujarat",
    content: "The way they handle digital branding is top-notch. Our visibility across Gujarat has improved, and our customer engagement scores have gone up by 45%.",
    image: getImagePath("/images/testimonials/profile.png"),
    star: 5,
  },
  {
    id: 4,
    name: "Pratik Gohil",
    designation: "From Vadodara, Gujarat",
    content: "Our team's productivity doubled after they set up the AI agents for follow-ups. Now, no lead is missed, even after office hours. Highly recommended!",
    image: getImagePath("/images/testimonials/profile.png"),
    star: 5,
  },
  {
    id: 5,
    name: "Kirtan M.",
    designation: "From Borsad, Gujarat",
    content: "Truly professional team that understands the local market. Their campaign approach saved us hours of manual outreach and delivered a very high ROI.",
    image: getImagePath("/images/testimonials/profile.png"),
    star: 5,
  },
  {
    id: 6,
    name: "Amit Yadav",
    designation: "From Khambhat, Gujarat",
    content: "They redesigned our platform with high-performance code and precision design. Our user engagement tripled, and the seamless interface transformed how we convert digital traffic into loyal customers.",
    image: getImagePath("/images/testimonials/profile.png"),
    star: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const testimonials = getTestimonialData();
  
  // Calculate total slides (3 testimonials per slide)
  const totalSlides = Math.ceil(testimonials.length / 3);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    
    // Resume auto-play after manual interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Get visible testimonials for current slide
  const visibleTestimonials = testimonials.slice(currentIndex * 3, currentIndex * 3 + 3);

  return (
    <section className="relative z-10 bg-white py-16 dark:bg-gray-950 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={
            <>
              What Our <span className="block text-primary sm:inline">Clients Say</span>
            </>}
          paragraph="Real results from businesses that transformed their operations with our AI-powered solutions."
          center
        />

        {/* Testimonials Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex">
              <SingleTestimonial testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Navigation Dots - Fixed calculation */}
        <div className="mt-10 flex justify-center space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? "w-8 bg-blue-600 dark:bg-blue-500" 
                  : "w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
              aria-label={`Go to testimonial group ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white dark:from-blue-700 dark:to-blue-800 sm:p-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">98%</div>
              <div className="text-sm opacity-90">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">50+</div>
              <div className="text-sm opacity-90">Businesses Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">4.9/5</div>
              <div className="text-sm opacity-90">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">24h</div>
              <div className="text-sm opacity-90">Avg. Implementation</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:gap-6 sm:p-8">
            <div className="text-center sm:text-left">
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                Ready to join our satisfied clients?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                See what our AI solutions can do for your business.
              </p>
            </div>
            <a
              href="/contact"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 overflow-hidden">
        <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>
    </section>
  );
};

export default Testimonials;
