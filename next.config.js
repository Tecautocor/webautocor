/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify ya no es necesario en Next 15, puedes quitarlo
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pilotsolution.net',
        pathname: '/**', // permite cualquier ruta dentro del dominio
      },
    ],
    // Desactivado por completo: bug de Next.js (LRUCache: calculateSize
    // returned 0) hace crecer sin limite la cache de /_next/image hasta
    // tumbar el proceso por memoria - causaba caidas intermitentes del sitio.
    unoptimized: true,
  },
};

module.exports = nextConfig;
