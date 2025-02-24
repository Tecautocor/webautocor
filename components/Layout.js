import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Script from "next/script";
import WhatsAppButton from "../components/WhatsAppButton"; // Importa el nuevo componente

export const metadata = {
  title: "AUTOCOR",
  description:
    "¡Somos el concesionario de todas las marcas! ¡Tenemos +500 seminuevos para ti en nuestras 7 agencias!",
  openGraph: {
    title: "AUTOCOR",
    description:
      "¡Somos el concesionario de todas las marcas! ¡Tenemos +500 seminuevos para ti en nuestras 7 agencias!",
    images: {
      url: "https://autocor.com.ec/share-redes.jpg",
      alt: "AUTOCOR",
    },
  },
  twitter: {
    title: "AUTOCOR",
    description:
      "¡Somos el concesionario de todas las marcas! ¡Tenemos +500 seminuevos para ti en nuestras 7 agencias!",
    images: {
      url: "https://autocor.com.ec/share-redes.jpg",
      alt: "AUTOCOR",
    },
  },
};

export default function Layout({ children, selected }) {
  return (
    <html lang="es">
      <head>
        {/* Cargar la fuente Sansation desde local */}
        <style>
          {`
            @font-face {
              font-family: 'Sansation';
              src: url('/fonts/Sansation-Regular.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
            }
            
            body {
              font-family: 'Sansation', sans-serif;
            }
          `}
        </style>
      </head>

      {/* Script para Hotjar */}
      <Script
        id="tag-hj"
        dangerouslySetInnerHTML={{
          __html: `(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3668859,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
        }}
      />

      {/* Script para Google Analytics */}
      <Script
        id="tag-gt"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-V76NTXMWDS');`,
        }}
      />
      <Script
        id="tag-gt-link"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-V76NTXMWDS"
      />

      {/* Script para Meta Pixel */}
      <Script
        id="tag-meta"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '614496607289016');
          fbq('track', 'PageView');`,
        }}
      />

      {/* Script para TikTok Pixel */}
      <Script
        id="tag-tiktok"
        dangerouslySetInnerHTML={{
          __html: `!function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('CKAQKKBC77UFTHK73ADG');
            ttq.page();
          }(window, document, 'ttq');`,
        }}
      />
      <body>
        <Header selected={selected} />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
