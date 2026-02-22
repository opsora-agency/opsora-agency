"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const MissionObjective = () => {
  return (
    <section className="bg-white py-16 dark:bg-gray-900 md:py-24 lg:py-32">
      <div className="container">
        <div className="-mx-4 flex flex-wrap lg:items-stretch">
          
          {/* Left Side: Height matches the text on the right */}
          <div className="w-full px-4 lg:w-1/2 mb-12 lg:mb-0">
            <div className="relative h-[400px] lg:h-full w-full overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
              <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-800">
                <p className="text-body-color italic text-center px-10 text-base">
                  [ Vertical office photo that spans from header to button ]
                </p>
                 <Image 
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=1200&fit=crop&auto=format" 
                  alt="Opsora Agency Full View" 
                  fill 
                  className="object-cover" 
                  priority
                /> 
                
              </div>
            </div>
          </div>

          {/* Right Side: Content determines the height */}
          <div className="w-full px-4 lg:w-1/2 flex flex-col justify-center">
            <div className="max-w-[540px] lg:ml-auto">
              <div className="mb-10">
                <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
                  Your Trusted Digital <span className="text-primary">Partner</span>
                </h2>
                
                <div className="space-y-10">
                  <div className="group">
                    <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-black dark:text-white sm:text-2xl">
                      <span className="h-[3px] w-8 bg-primary rounded-full transition-all group-hover:w-12"></span>
                      Our Mission
                    </h3>
                    <p className="text-base leading-relaxed text-body-color dark:text-gray-400 sm:text-lg">
                      To empower businesses with scientific precision in digital solutions. We deliver measurable growth by blending high-impact marketing with intelligent AI systems designed to scale your revenue pipelines automatically.
                    </p>
                  </div>

                  <div className="group">
                    <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-black dark:text-white sm:text-2xl">
                      <span className="h-[3px] w-8 bg-primary rounded-full transition-all group-hover:w-12"></span>
                      Our Objective
                    </h3>
                    <p className="text-base leading-relaxed text-body-color dark:text-gray-400 sm:text-lg">
                      To be your strategic partner in long-term digital evolution. We align technical workflows with core business outcomes to build a dominant online presence with medical-grade data accuracy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/contact">
                <button className="rounded-xl bg-primary px-10 py-3.5 text-base font-bold text-white transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95">
                  Partner with Us
                </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissionObjective;
