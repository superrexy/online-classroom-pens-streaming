/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL_API: process.env.BASE_URL_API,
  },
};

export default nextConfig;
