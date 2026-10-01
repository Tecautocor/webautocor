/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite compilar a una carpeta aparte durante el deploy (ver deploy.sh)
  // sin tocar el .next que el proceso viejo sigue sirviendo mientras compila.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
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
  // La landing del evento se renombró de /race-track a /activacion;
  // se mantiene el link viejo para no romper los ya compartidos.
  async redirects() {
    return [{ source: "/race-track", destination: "/activacion", permanent: false }];
  },
};

module.exports = nextConfig;
