/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: ['172.20.10.4', 'localhost:3000', '172.20.10.4:3000'],
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
