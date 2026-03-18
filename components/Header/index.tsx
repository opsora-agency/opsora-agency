"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const [activeService, setActiveService] = useState(null);
  
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
      setActiveService(null);
    } else {
      setOpenIndex(index);
      setActiveService(null);
    }
  };

  const handleServiceHover = (service) => {
    if (service.submenu) {
      setActiveService(service);
    }
  };

  const usePathName = usePathname();

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition dark:bg-gray-dark dark:shadow-sticky-dark"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            {/* LEFT SIDE: For mobile only - Hamburger menu and logo side by side */}
            <div className="flex flex-1 items-center lg:hidden">
              {/* Hamburger menu button */}
              <div className="px-4">
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="rounded-lg px-3 py-[6px] ring-primary focus:ring-2"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0 " : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
              </div>
              
              {/* Logo for mobile - positioned right after hamburger */}
              <div className="flex-1">
                <Link
                  href="/"
                  className={`header-logo block ${
                    sticky ? "py-5" : "py-8"
                  }`}
                >
                  <Image
                    src={getImagePath("/images/logo/logo-2.svg")}
                    alt="logo"
                    width={140}
                    height={40}
                    className="w-full dark:hidden lg:w-auto lg:max-w-[200px]"
                    priority
                  />
                  <Image
                    src={getImagePath("/images/logo/logo.svg")}
                    alt="logo"
                    width={140}
                    height={40}
                    className="hidden w-full dark:block lg:w-auto lg:max-w-[200px]"
                    priority
                  />
                </Link>
              </div>
            </div>
            
            {/* Logo for desktop (hidden on mobile) */}
            <div className="hidden w-60 max-w-full px-4 xl:mr-12 lg:block lg:pl-0">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-5 lg:py-2" : "py-8 lg:py-6"
                }`}
              >
                <Image
                  src={getImagePath("/images/logo/logo-2.svg")}
                  alt="logo"
                  width={200}
                  height={40}
                  className="w-full dark:hidden lg:w-auto lg:max-w-[200px]"
                  priority
                />
                <Image
                  src={getImagePath("/images/logo/logo.svg")}
                  alt="logo"
                  width={200}
                  height={40}
                  className="hidden w-full dark:block lg:w-auto lg:max-w-[200px]"
                  priority
                />
              </Link>
            </div>
            
            {/* Desktop Navigation - Centered (hidden on mobile) */}
            <div className="hidden lg:flex lg:flex-1 lg:justify-center">
              <nav
                id="navbarCollapse"
                className="navbar flex items-center"
              >
                <ul className="flex space-x-9">
                  {menuData.map((menuItem, index) => (
                    <li key={index} className="group relative">
                      {!menuItem.submenu ? (
                        <Link
                          href={menuItem.path}
                          className={`flex py-2 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                            usePathName === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      ) : (
                        <>
                          <p
                            onClick={() => handleSubmenu(index)}
                            className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:inline-flex lg:px-0 lg:py-6"
                          >
                            {menuItem.title}
                            <span className="pl-3">
                              <svg width="25" height="24" viewBox="0 0 25 24">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </p>
                          <div
                            className={`submenu absolute left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:flex lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                              openIndex === index ? "block" : "hidden"
                            }`}
                            style={{ minWidth: activeService ? '800px' : '400px' }}
                          >
                            {/* Left Panel - Main Services */}
                            <div className={`p-4 ${activeService ? 'w-2/5' : 'w-full'}`}>
                              {menuItem.submenu.map((service, idx) => (
                                <div key={idx} className="mb-1 last:mb-0">
                                  <Link
                                    href={service.path}
                                    onMouseEnter={() => handleServiceHover(service)}
                                    onClick={() => !service.submenu && setOpenIndex(-1)}
                                    className={`flex items-center gap-3 rounded px-3 py-2.5 transition-colors ${
                                      activeService?.id === service.id
                                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                                        : "hover:bg-gray-50 hover:text-primary dark:hover:bg-gray-800"
                                    }`}
                                  >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                      {service.icon}
                                    </div>
                                    <span className="text-sm font-medium">{service.title}</span>
                                    {service.submenu && (
                                      <svg className="ml-auto h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    )}
                                  </Link>
                                </div>
                              ))}
                            </div>

                            {/* Right Panel - Sub Services (Only shows when activeService exists) */}
                            {activeService && (
                              <div className="w-3/5 border-l border-gray-100 p-4 dark:border-gray-700">
                                <div className="space-y-1">
                                  {activeService.submenu.map((subService, subIdx) => (
                                    <Link
                                      href={subService.path}
                                      key={subIdx}
                                      onClick={() => setOpenIndex(-1)}
                                      className="group flex items-center gap-3 rounded px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                      <div className="flex h-5 w-5 items-center justify-center">
                                        {subService.icon}
                                      </div>
                                      <span className="text-sm">{subService.title}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            
            {/* RIGHT SIDE: WhatsApp and ThemeToggle buttons */}
            <div className="flex items-center justify-end px-4">
              <div className="flex items-center space-x-4">
                {/* WhatsApp Button */}
                <Link
                  href="https://wa.me/918401765505?text=Hi%20Opsora%20Agency%2C%20I'm%20interested%20in%20your%20services.%20Can%20you%20please%20share%20more%20details%3F"
                  className="flex h-10 w-10 items-center justify-center text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                  aria-label="Contact on WhatsApp"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.897 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                  </svg>
                </Link>

                {/* Theme Toggler - Properly aligned */}
                <div className="flex items-center">
                  <ThemeToggler />
                </div>

                {/* Client Login Button - Desktop */}
                <Link
                  href="https://opsora-pulse-panel.lovable.app/"
                  className="hidden rounded-full border border-gray-300 bg-transparent px-5 py-2 text-sm font-medium text-dark hover:border-primary hover:text-primary dark:border-gray-600 dark:text-white dark:hover:border-primary dark:hover:text-primary md:block"
                >
                  Client Login
                </Link>

                {/* Contact Now Button - Desktop */}
                <Link
                  href="/contact"
                  className="hidden rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 hover:shadow-md md:block"
                >
                  Contact Now
                </Link>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation Sidebar */}
          <nav
            className={`navbar fixed left-0 top-0 z-30 h-screen w-[280px] overflow-y-auto border-r border-body-color/50 bg-white px-6 py-8 duration-300 dark:border-body-color/20 dark:bg-dark lg:hidden ${
              navbarOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            {/* Mobile Close Button */}
            <button
              onClick={navbarToggleHandler}
              className="absolute right-4 top-4"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Mobile Menu Items */}
            <ul className="block pt-8">
              {menuData.map((menuItem, index) => (
                <li key={index} className="group relative mb-4 last:mb-0">
                  {!menuItem.submenu ? (
                    <Link
                      href={menuItem.path}
                      onClick={() => setNavbarOpen(false)}
                      className={`flex py-2 text-base ${
                        usePathName === menuItem.path
                          ? "text-primary dark:text-white"
                          : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                      }`}
                    >
                      {menuItem.title}
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <p
                          onClick={() => handleSubmenu(index)}
                          className="flex cursor-pointer items-center py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white"
                        >
                          {menuItem.title}
                        </p>
                        <button
                          onClick={() => handleSubmenu(index)}
                          className="ml-2"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={openIndex === index ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                          </svg>
                        </button>
                      </div>
                      <div
                        className={`pl-4 ${
                          openIndex === index ? "block" : "hidden"
                        }`}
                      >
                        {menuItem.submenu.map((service, idx) => (
                          <div key={idx} className="mb-3 last:mb-0">
                            {service.submenu ? (
                              <>
                                <div className="flex items-center justify-between rounded py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <Link
                                    href={service.path}
                                    onClick={() => setNavbarOpen(false)}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="flex h-5 w-5 items-center justify-center">
                                      {service.icon}
                                    </div>
                                    <span className="text-sm font-medium">{service.title}</span>
                                  </Link>
                                  <button
                                    onClick={() => setActiveService(activeService?.id === service.id ? null : service)}
                                    className="ml-2"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activeService?.id === service.id ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                                    </svg>
                                  </button>
                                </div>
                                
                                {activeService?.id === service.id && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {service.submenu.map((subService, subIdx) => (
                                      <Link
                                        href={subService.path}
                                        key={subIdx}
                                        onClick={() => setNavbarOpen(false)}
                                        className="flex items-center gap-2 rounded py-2 pl-2 pr-3 text-sm"
                                      >
                                        <div className="flex h-3 w-3 items-center justify-center">
                                          {subService.icon}
                                        </div>
                                        <span>{subService.title}</span>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                href={service.path}
                                onClick={() => setNavbarOpen(false)}
                                className="flex items-center gap-2 rounded py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <div className="flex h-5 w-5 items-center justify-center">
                                  {service.icon}
                                </div>
                                <span>{service.title}</span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Buttons in Sidebar */}
            <div className="mt-12 space-y-4">
              <Link
                href="https://opsora-pulse-panel.lovable.app/"
                onClick={() => setNavbarOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-transparent px-6 py-3 text-sm font-medium text-dark hover:border-primary hover:text-primary dark:border-gray-600 dark:text-white dark:hover:border-primary dark:hover:text-primary"
              >
                Client Login
              </Link>

              <Link
                href="https://wa.me/918401765505?text=Hi%20Opsora%20Agency%2C%20I'm%20interested%20in%20your%20services.%20Can%20you%20please%20share%20more%20details%3F"
                onClick={() => setNavbarOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 hover:shadow-md"
              >
                Contact Now
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
