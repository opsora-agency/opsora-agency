"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import ChatBot from '@/components/ChatBot/ChatBot';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script' // Add this import

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      
      {/* Google Analytics - Moved inside the component, not as HTML comment */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-EV2CG1PM5D"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EV2CG1PM5D');
        `}
      </Script>

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
          <ChatBot />
          <SpeedInsights /> {/* You can add SpeedInsights here if you want */}
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
