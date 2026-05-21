"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = ["/background1.jpg", "/background2.jpg", "/background3.jpg"];

export default function BackgroundCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex justify-center items-start pt-12">
      <div className="relative w-full max-w-6xl h-full flex justify-center items-center">

        {/* Carrusel de imágenes */}
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{ width: "100%", height: "100%" }}
          >
            <Image
              src={img}
              alt={`Background ${index + 1}`}
              fill
              style={{ objectFit: "contain", objectPosition: "center" }}
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Overlay clicable limitado al carrusel */}
        <a
          href="https://walink.co/symv1w"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-0 left-0 w-full h-full z-10"
        />
      </div>
    </div>
  );
}
