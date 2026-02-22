"use client";

import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const totalSlides = 11;

  // Next slide function
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  // Previous slide function
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Go to specific slide
  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  // Open modal with current slide
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setIsAutoPlaying(false);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setIsAutoPlaying(true), 1000);
  }, []);

  // Auto slide functionality
  useEffect(() => {
    if (!isAutoPlaying || isModalOpen) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isModalOpen, nextSlide]);

  // Pause auto play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
      if (e.key === 'ArrowLeft') {
        prevSlide();
      }
      if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, prevSlide, nextSlide]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.paddingRight = '';
    };
  }, [isModalOpen]);

  // Add click outside to close modal
  useEffect(() => {
    if (isModalOpen) {
      const handleClickOutside = (e) => {
        if (modalRef.current && modalRef.current === e.target) {
          closeModal();
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isModalOpen, closeModal]);

  return (
    <>
      <section className="relative z-10 py-16 md:py-20 lg:py-28">
        <div className="container">
          {/* Section Header */}
          <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              Our Work
            </span>
            <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-5xl">
              See How We
              <span className="block text-primary sm:inline"> Transform Businesses</span>
            </h2>
            <p className="mx-auto text-base text-body-color dark:text-gray-400 sm:text-lg">
             Driving Sustainable Growth Through Innovative Digital Solutions.
            </p>
          </div>

          {/* Main Slider Container */}
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div
                className="wow fadeInUp mx-auto max-w-[900px] overflow-hidden rounded-lg shadow-2xl transition-all duration-300 hover:shadow-3xl"
                data-wow-delay=".15s"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div 
                  className="group relative aspect-[16/9] overflow-hidden bg-gray-900 cursor-pointer select-none"
                  onClick={openModal}
                  onKeyDown={(e) => e.key === 'Enter' && openModal()}
                  tabIndex={0}
                  role="button"
                  aria-label="Open image gallery in full screen"
                >
                  {/* Main Image Display */}
                  <div className="relative h-full w-full">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Image
                          src={getImagePath(`/images/portfolio/${index + 1}.png`)}
                          alt={``}
                          fill
                          className="object-cover"
                          priority={index === currentSlide}
                          sizes="(max-width: 768px) 100vw, 900px"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="group absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/80 active:scale-110 sm:left-3 sm:h-9 sm:w-9 md:left-4 md:h-10 md:w-10 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Previous slide"
                  >
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="group absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/80 active:scale-110 sm:right-3 sm:h-9 sm:w-9 md:right-4 md:h-10 md:w-10 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Next slide"
                  >
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Slide Indicators */}
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-4 sm:gap-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToSlide(index);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                          index === currentSlide 
                            ? "w-6 bg-white shadow-lg" 
                            : "w-1.5 bg-white/60 hover:bg-white/80 active:bg-white"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === currentSlide ? "true" : "false"}
                      />
                    ))}
                  </div>

                  {/* Auto Play Indicator */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 sm:top-4 sm:right-4">
                    <div className={`h-1.5 w-1.5 rounded-full ${isAutoPlaying ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                    <span className="text-[10px] text-white/70 sm:text-xs">
                      {isAutoPlaying ? "Auto" : "Paused"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="mt-6 sm:mt-8">
            <div className="flex justify-center overflow-x-auto pb-2 sm:pb-4">
              <div className="flex gap-2 px-2 sm:gap-3 sm:px-4">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`group relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 active:scale-105 sm:h-14 sm:w-20 md:h-16 md:w-24 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                      index === currentSlide 
                        ? "ring-1 ring-blue-500 ring-offset-1 scale-105 sm:ring-2" 
                        : "opacity-70 active:opacity-100 active:scale-105"
                    }`}
                    aria-label={`View Project ${index + 1}`}
                    aria-current={index === currentSlide ? "true" : "false"}
                  >
                    <Image
                      src={getImagePath(`/images/portfolio/${index + 1}.png`)}
                      alt={`Thumbnail for Project ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                    />
                    <div className={`absolute inset-0 ${
                      index === currentSlide ? "bg-blue-500/20" : "bg-black/30 group-active:bg-black/20"
                    }`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Original Background */}
        <div className="absolute bottom-0 left-0 right-0 z-[-1] h-full w-full bg-[url(/images/video/shape.svg)] bg-cover bg-center bg-no-repeat"></div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div 
          ref={modalRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-300"
          onClick={closeModal}
        >
          {/* Modal Content Container - Centered properly */}
          <div 
            className="relative h-[90vh] w-full max-w-[95vw] md:max-w-[90vw] md:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Adjusted position */}
            <button
              onClick={closeModal}
              className="absolute -top-8 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg transition-all duration-300 hover:bg-white/20 active:scale-95 md:-top-12 md:h-12 md:w-12 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-1 top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg transition-all duration-300 hover:bg-white/20 active:scale-95 sm:left-2 sm:h-10 sm:w-10 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Previous slide"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-1 top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg transition-all duration-300 hover:bg-white/20 active:scale-95 sm:right-2 sm:h-10 sm:w-10 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Next slide"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Main Modal Content */}
            <div className="relative h-full w-full overflow-hidden rounded-lg md:rounded-xl">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={getImagePath(`/images/portfolio/${index + 1}.png`)}
                    alt={`Full screen view of Project ${index + 1}`}
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
                  />
                </div>
              ))}
            </div>

            {/* Modal Slide Indicators */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-4 sm:gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                    index === currentSlide 
                      ? "w-6 bg-white" 
                      : "w-1.5 bg-white/40 hover:bg-white/60 active:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide ? "true" : "false"}
                />
              ))}
            </div>
          </div>
        </div>
      )}


      

     


      
    </>
  );
};

export default ImageSlider;
