"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import ChatBot from '@/components/ChatBot/ChatBot';
import Notification from '@/components/Notificationpopup/notification';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <Analytics />
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
          <Notification />
          <SpeedInsights/>
          <ChatBot />
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-EV2CG1PM5D" />
    </html>
  );
}

import { Providers } from "./providers";


