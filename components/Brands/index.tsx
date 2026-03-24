// Brands/index.tsx
"use client";

import Image from "next/image";
import { Brand } from "@/types/brand";
import { topRowBrands, bottomRowBrands } from "./brandsData";

const Brands = () => {
  return (
    <section className="py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Compact Title */}
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
           Tools <span className="block text-primary sm:inline">We Trust</span>
          </h2>
          <p className="mx-auto max-w-xl text-gray-600 dark:text-gray-400">
            Industry-leading technologies powering our services
          </p>
        </div>

        {/* Top Row: Left to Right */}
        <div className="relative mb-6 overflow-hidden py-3">
          <div className="flex animate-scroll-left space-x-10 md:animate-scroll-left">
            {[...topRowBrands, ...topRowBrands, ...topRowBrands].map((brand, index) => (
              <SingleBrand key={`top-${brand.id}-${index}`} brand={brand} />
            ))}
          </div>
        </div>

        {/* Bottom Row: Right to Left */}
        <div className="relative overflow-hidden py-3">
          <div className="flex animate-scroll-right space-x-10 md:animate-scroll-right">
            {[...bottomRowBrands, ...bottomRowBrands, ...bottomRowBrands].map((brand, index) => (
              <SingleBrand key={`bottom-${brand.id}-${index}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { href, name, image, imageLight } = brand;

  return (
    <div className="flex shrink-0 items-center justify-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center opacity-80 transition-all duration-300 hover:opacity-100 dark:opacity-70"
      >
        {/* Logo Container */}
        <div className="relative h-16 w-32 md:h-20 md:w-40">
          {/* Light mode logo */}
          <div className="relative h-full w-full dark:hidden">
            <Image
              src={image}
              alt={`${name} logo`}
              fill
              className="object-contain p-4 transition-all duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 128px, 160px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/160x80/000000/FFFFFF?text=${encodeURIComponent(name)}&font=inter`;
              }}
            />
          </div>
          
          {/* Dark mode logo */}
          <div className="relative hidden h-full w-full dark:block">
            <Image
              src={imageLight || image}
              alt={`${name} logo`}
              fill
              className="object-contain p-4 transition-all duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 128px, 160px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/160x80/FFFFFF/000000?text=${encodeURIComponent(name)}&font=inter`;
              }}
            />
          </div>
        </div>
      </a>
    </div>
  );
};
