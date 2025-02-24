/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["cdn.pilotsolution.net"],
  },
};

module.exports = nextConfig;
