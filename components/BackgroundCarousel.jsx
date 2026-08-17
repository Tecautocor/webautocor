"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { trackConversion } from "../lib/analytics";
import { useListBannersQuery } from "../lib/hooks";

export default function BackgroundCarousel() {
  const { data } = useListBannersQuery();
  const images = data?.entitydata || [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [images.length]);

  useEffect(() => {
    if (images.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 flex justify-center items-start pt-12">
      <div className="relative w-full max-w-6xl h-full flex justify-center items-center">

        {/* Carrusel de imágenes (fuente: tabla Banner, administrable en /admin/banners) */}
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`absolute transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{ width: "100%", height: "100%" }}
          >
            <Image
              src={img.src}
              alt={`Background ${index + 1}`}
              fill
              style={{ objectFit: "contain", objectPosition: "center" }}
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Overlay clicable limitado al carrusel (destino según la imagen visible) */}
        <a
          href={images[current].href}
          target={images[current].external ? "_blank" : undefined}
          rel={images[current].external ? "noopener noreferrer" : undefined}
          onClick={() => {
            if (images[current].external) {
              trackConversion("whatsapp", `banner_${images[current].src}`);
            }
          }}
          className="absolute top-0 left-0 w-full h-full z-10"
        />
      </div>
    </div>
  );
}
