"use client";

import Script from 'next/script'

const GoogleAnalytics = () => {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-EV2CG1PM5D" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EV2CG1PM5D');
        `}
      </Script>
    </>
  )
}

export default GoogleAnalytics
