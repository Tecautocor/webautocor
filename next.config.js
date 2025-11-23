/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify ya no es necesario en Next 15, puedes quitarlo
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pilotsolution.net',
        pathname: '/**', // permite cualquier ruta dentro del dominio
      },
    ],
  },
};

module.exports = nextConfig;
